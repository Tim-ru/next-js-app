"use client";

import { create, type StoreApi } from "zustand";

import { getApiErrorMessage, setAccessToken } from "@/lib/axios";
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
  isAuthLoading: boolean;
  isAuthInitialized: boolean;
  authError: string | null;
  initAuth: () => void;
  login: (payload: LoginRequest) => Promise<void>;
  logout: () => void;
  clearAuthError: () => void;
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
  isAuthLoading: true,
  isAuthInitialized: false,
  authError: null,

  initAuth: () => {
    set({
      isAuthLoading: true,
      authError: null,
    });

    try {
      const session = readStoredSession();

      if (!session) {
        persistSession(null);
      }

      applySession(session, set);
    } catch {
      persistSession(null);
      applySession(null, set);
      set({
        authError: "Failed to restore the saved session. Please sign in again.",
      });
    } finally {
      set({
        isAuthLoading: false,
      });
    }
  },

  login: async (payload) => {
    set({
      isAuthLoading: true,
      authError: null,
    });

    try {
      const response = await authService.login(payload);
      const session = {
        accessToken: response.accessToken,
        user: toAuthUser(response),
      };

      persistSession(session);
      applySession(session, set);
    } catch (error) {
      set({
        authError: getApiErrorMessage(error),
      });
      throw error;
    } finally {
      set({
        isAuthLoading: false,
      });
    }
  },

  logout: () => {
    set({
      isAuthLoading: true,
      authError: null,
    });

    try {
      persistSession(null);
      applySession(null, set);
    } finally {
      set({
        isAuthLoading: false,
      });
    }
  },

  clearAuthError: () => {
    set({
      authError: null,
    });
  },
}));
