import { apiClient } from "./client";
import type { IUser } from "../types/api";

export interface AuthCredentials {
  email: string;
  password: string;
}

export interface RawAuthResponse {
  access_token: string;
  refresh_token: string;
  user: IUser;
}

export const authApi = {
  register: (credentials: AuthCredentials) =>
    apiClient<RawAuthResponse>("/api/v1/auth/register", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  login: (credentials: AuthCredentials) =>
    apiClient<RawAuthResponse>("/api/v1/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),

  logout: (refreshToken: string | null) =>
    apiClient<null>("/api/v1/auth/logout", {
      method: "POST",
      body: JSON.stringify({ refresh_token: refreshToken }),
    }),

  // logoutAllDevices: () =>
  //   apiClient<null>("/api/v1/auth/logout-all", {
  //     method: "POST",
  //   }),
};