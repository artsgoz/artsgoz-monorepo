import { auth } from './firebase';

export interface BackendUser {
  id: string;
  firebase_uid: string;
  username: string;
  email: string;
  role: string;
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

export const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL ||
  import.meta.env.VITE_API_URL ||
  ''
).replace(/\/+$/, '');

export function apiErrorMessage(value: unknown, fallback: string): string {
  if (!value || typeof value !== 'object') return fallback;
  const body = value as { message?: unknown; error?: unknown };
  if (typeof body.message === 'string') return body.message;
  if (typeof body.error === 'string') return body.error;
  if (
    body.error &&
    typeof body.error === 'object' &&
    'message' in body.error &&
    typeof body.error.message === 'string'
  )
    return body.error.message;
  return fallback;
}

export async function backendRequest<T>(
  path: string,
  options: RequestInit = {},
  authenticated = false,
): Promise<T> {
  if (!API_BASE_URL) throw new Error('VITE_API_BASE_URL is not configured.');
  if (!path.startsWith('/') || path.startsWith('//') || /[\\#]/.test(path))
    throw new Error('Invalid API path.');
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    !headers.has('Content-Type')
  )
    headers.set('Content-Type', 'application/json');
  if (authenticated) {
    if (!auth.currentUser) throw new Error('Please sign in first.');
    headers.set(
      'Authorization',
      `Bearer ${await auth.currentUser.getIdToken()}`,
    );
  }
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    redirect: 'error',
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok)
    throw new Error(
      apiErrorMessage(body, `API request failed (${response.status}).`),
    );
  return body as T;
}
