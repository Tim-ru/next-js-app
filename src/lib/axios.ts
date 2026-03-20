import axios, { AxiosError } from "axios";

import type { ApiErrorResponse } from "@/types/api.types";

const API_BASE_URL = "https://dummyjson.com";

let accessToken: string | null = null;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

api.interceptors.request.use((config) => {
  if (!accessToken) {
    return config;
  }

  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
});

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError<ApiErrorResponse>(error)) {
    const responseMessage = error.response?.data?.message;
    const responseError = error.response?.data?.error;

    return responseMessage ?? responseError ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

export type ApiError = AxiosError<ApiErrorResponse>;
