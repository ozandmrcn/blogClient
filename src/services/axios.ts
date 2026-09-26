import type { InternalAxiosRequestConfig } from "axios";
import axios from "axios";
import { isLoggedIn, setLoggedIn } from "../utils/session";

/**
 * Origin the API is reached through, without the `/api` prefix — the service
 * modules already carry that prefix.
 *
 * In production the client and the API share an origin, because Vercel proxies
 * `/api/*` to Render. An empty value therefore keeps every request first-party,
 * which is what lets the httpOnly auth cookies survive: a cross-site request
 * would be third-party and Chrome drops those cookies. Local development points
 * straight at the API through `.env`.
 */
const configuredBaseUrl = import.meta.env.VITE_API_URL ?? "";

const baseURL = configuredBaseUrl
  .replace(/\/+$/, "")
  .replace(/\/api$/, "");

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
    // `isLoggedIn` guards this because an anonymous visitor has no refresh
    // token to spend — without it, every stale flag would fire a 401 → refresh
    // → logout chain that cannot succeed.
    const isExpiredAccessToken =
      error.response?.status === 401 &&
      Boolean(originalRequest) &&
      isLoggedIn() &&
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
        // Clearing the flag first stops the next page load from retrying it,
        // and the logout failure must not prevent the redirect below.
        setLoggedIn(false);

        try {
          await authService.logout();
        } catch {
          // The session is already unusable, so there is nothing to clear
          // server-side.
        }

        window.location.assign("/login");

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
