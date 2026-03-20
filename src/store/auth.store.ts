"use client";

import { create, type StoreApi } from "zustand";

import { setAccessToken } from "@/lib/axios";
import { authService } from "@/services/auth.service";
import type { AuthUser, LoginRequest, LoginResponse } from "@/types/auth.types";

const AUTH_STORAGE_KEY = "dummyjson-shop-auth";

interface StoredAuthSession {
  accessToken: string;
  user: AuthUser;
}

interface AuthState {
  accessToken: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  isAuthInitialized: boolean;
  initAuth: () => void;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
}

function toAuthUser(response: LoginResponse): AuthUser {
  return {
    id: response.id,
    username: response.username,
    email: response.email,
    firstName: response.firstName,
    lastName: response.lastName,
    gender: response.gender,
    image: response.image,
  };
}

function readStoredSession(): StoredAuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const rawValue = window.localStorage.getItem(AUTH_STORAGE_KEY);

  if (!rawValue) {
    return null;
  }

  try {
    const parsedValue = JSON.parse(rawValue) as Partial<StoredAuthSession>;

    if (
      typeof parsedValue.accessToken !== "string" ||
      !parsedValue.user ||
      typeof parsedValue.user.id !== "number" ||
      typeof parsedValue.user.username !== "string"
    ) {
      return null;
    }

    return {
      accessToken: parsedValue.accessToken,
      user: parsedValue.user,
    };
  } catch {
    return null;
  }
}

function persistSession(session: StoredAuthSession | null): void {
  if (typeof window === "undefined") {
    return;
  }

  if (!session) {
    window.localStorage.removeItem(AUTH_STORAGE_KEY);

    return;
  }

  window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
}

function applySession(
  session: StoredAuthSession | null,
  set: StoreApi<AuthState>["setState"],
): void {
  setAccessToken(session?.accessToken ?? null);
  set({
    accessToken: session?.accessToken ?? null,
    user: session?.user ?? null,
    isAuthenticated: Boolean(session),
    isAuthInitialized: true,
  });
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isAuthInitialized: false,

  initAuth: () => {
    const session = readStoredSession();

    if (!session) {
      persistSession(null);
    }

    applySession(session, set);
  },

  login: async (payload) => {
    const response = await authService.login(payload);
    const session = {
      accessToken: response.accessToken,
      user: toAuthUser(response),
    };

    persistSession(session);
    applySession(session, set);
  },

  logout: () => {
    persistSession(null);
    applySession(null, set);
  },
}));
