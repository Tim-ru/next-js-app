import { api } from "@/lib/axios";
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RefreshSessionRequest,
  RefreshSessionResponse,
} from "@/types/auth.types";

const AUTH_ENDPOINTS = {
  currentUser: "/auth/me",
  login: "/auth/login",
  refresh: "/auth/refresh",
} as const;

export const authService = {
  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>(
      AUTH_ENDPOINTS.login,
      payload,
    );

    return data;
  },

  async getCurrentUser(): Promise<AuthUser> {
    const { data } = await api.get<AuthUser>(AUTH_ENDPOINTS.currentUser);

    return data;
  },

  async refreshSession(
    payload: RefreshSessionRequest,
  ): Promise<RefreshSessionResponse> {
    const { data } = await api.post<RefreshSessionResponse>(
      AUTH_ENDPOINTS.refresh,
      payload,
    );

    return data;
  },
};
