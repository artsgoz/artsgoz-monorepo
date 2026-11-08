import axios, { type AxiosRequestConfig, isAxiosError } from 'axios';
import { auth, API_BASE_URL, apiErrorMessage } from '@base-components';
import { ApiError } from './types.js';

const BASE_URL = API_BASE_URL;

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  if (!API_BASE_URL) throw new Error('VITE_API_BASE_URL is not configured.');
  return config;
});

export const handleApiError = (error: unknown): never => {
  if (isAxiosError(error)) {
    const status = error.response?.status;
    const responseData = error.response?.data as
      { message?: string; error?: string; detail?: string } | undefined;

    const message = apiErrorMessage(
      responseData,
      error.message || 'An unexpected error occurred',
    );

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

export const getFirebaseIdToken = async (
  forceRefresh = false,
): Promise<string | null> => {
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

export const getAuthHeadersWithCurrentFirebaseUser =
  async (): Promise<AxiosRequestConfig> => {
    const token = await getFirebaseIdToken();
    return getAuthHeaders(token || undefined);
  };
