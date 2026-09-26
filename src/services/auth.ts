import type { LoginValues, MessageResponse, RegisterValues, UpdateProfileValues, User } from "../types";
import api from "./axios";

const authService = {
  login: async (values: LoginValues) => {
    const res = await api.post<User>("/api/auth/login", values);

    return res.data;
  },

  register: async (values: RegisterValues) => {
    const res = await api.post<User>("/api/auth/register", values);

    return res.data;
  },

  logout: async () => {
    const res = await api.post<MessageResponse>("/api/auth/logout");

    return res.data;
  },

  /** Exchanges the refresh cookie for a new access cookie. */
  refreshToken: async () => {
    const res = await api.post<MessageResponse>("/api/auth/refresh-token");

    return res.data;
  },

  getProfile: async () => {
    const res = await api.get<User>("/api/user/me");

    return res.data;
  },

  updateProfile: async (values: UpdateProfileValues) => {
    const res = await api.patch<User>("/api/user/me", values);

    return res.data;
  },
};

export default authService;
