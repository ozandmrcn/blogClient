import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";

/** Base URL of the API, without the `/api` prefix. */
const baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

/** A request that has already been replayed once after a token refresh. */
type RetriableRequest = InternalAxiosRequestConfig & { retried?: boolean };

/**
 * Endpoints that must never trigger a refresh attempt. Without this list the
 * interceptor would try to refresh the token while handling a failed refresh,
 * and logout would recurse indefinitely.
 */
const NO_REFRESH_PATHS = [
  "/auth/login",
  "/auth/register",
  "/auth/logout",
  "/auth/refresh-token",
];

const api = axios.create({
  baseURL,
  // Required so the httpOnly auth cookies travel with every request.
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  // Pass successful responses straight through.
  (res) => res,
  async (error) => {
    const originalRequest = error.config as RetriableRequest | undefined;
    const path = originalRequest?.url ?? "";

    // A 401 on a recoverable endpoint means the access token has expired:
    // mint a new one with the refresh token, then replay the original request.
    const isExpiredAccessToken =
      error.response?.status === 401 &&
      Boolean(originalRequest) &&
      !originalRequest?.retried &&
      !NO_REFRESH_PATHS.some((noRefreshPath) => path.includes(noRefreshPath));

    if (isExpiredAccessToken && originalRequest) {
      originalRequest.retried = true;

      // Imported lazily to keep this module free of a circular dependency with
      // the auth service, which itself needs this axios instance.
      const { default: authService } = await import("./auth");

      try {
        await authService.refreshToken();

        return api.request(originalRequest);
      } catch {
        // The refresh token is expired or revoked, so the session is over.
        await authService.logout();
        window.location.assign("/login");

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
