import type { User } from "../types/user";
import { apiRequest } from "./client";

type Credentials = { email: string; password: string };

type AuthResponse = { user: User };

export const authApi = {
  login: (body: Credentials) =>
    apiRequest<AuthResponse>("/auth/login", { method: "POST", body }),

  register: (body: Credentials) =>
    apiRequest<AuthResponse>("/auth/register", { method: "POST", body }),

  me: () => apiRequest<AuthResponse>("/auth/me"),

  logout: () => apiRequest<null>("/auth/logout", { method: "POST" }),
};
