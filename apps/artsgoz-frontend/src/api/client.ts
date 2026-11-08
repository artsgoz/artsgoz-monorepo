import axios, { type AxiosRequestConfig, isAxiosError } from 'axios';
import { auth } from '../lib/firebase.js';
import { ApiError } from './types.js';

const BASE_URL = (import.meta.env.VITE_API_URL as string) || 'http://localhost:8080';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const handleApiError = (error: unknown): never => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data as
      | { message?: string; error?: string; detail?: string }
      | undefined;

    const message =
      responseData?.message ||
      responseData?.error ||
      responseData?.detail ||
      error.message ||
      'An unexpected error occurred';

    throw new ApiError(message, status, responseData, responseData?.detail);
  }

  if (error instanceof ApiError) {
    throw error;
  }

  if (error instanceof Error) {
    throw new ApiError(error.message);
  }

  throw new ApiError('An unknown error occurred', undefined, error);
};

export const getFirebaseIdToken = async (forceRefresh = false): Promise<string | null> => {
  const currentUser = auth.currentUser;
  if (!currentUser) return null;
  return currentUser.getIdToken(forceRefresh);
};

export const getAuthHeaders = (token?: string): AxiosRequestConfig => {
  if (!token) return {};
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getAuthHeadersWithCurrentFirebaseUser = async (): Promise<AxiosRequestConfig> => {
  const token = await getFirebaseIdToken();
  return getAuthHeaders(token || undefined);
};

