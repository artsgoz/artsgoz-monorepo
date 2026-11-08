import { apiClient, getAuthHeaders, handleApiError } from './client.js';
import type {
  AdminDashboardResponse,
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
  UpdateUserRoleRequest,
  User,
} from './types.js';

export const register = async (data: RegisterRequest): Promise<{ message: string }> => {
  try {
    const res = await apiClient.post<{ message: string }>('/register', data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  try {
    const res = await apiClient.post<LoginResponse>('/login', data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getMe = async (token: string): Promise<MeResponse> => {
  try {
    const res = await apiClient.get<MeResponse>('/me', getAuthHeaders(token));
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAdminDashboard = async (token: string): Promise<AdminDashboardResponse> => {
  try {
    const res = await apiClient.get<AdminDashboardResponse>('/admin/dashboard', getAuthHeaders(token));
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAdminUsers = async (token: string): Promise<User[]> => {
  try {
    const res = await apiClient.get<User[]>('/admin/users', getAuthHeaders(token));
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateUserRole = async (
  uid: string,
  role: string,
  token: string
): Promise<{ message: string }> => {
  try {
    const reqBody: UpdateUserRoleRequest = { role };
    const res = await apiClient.put<{ message: string }>(
      `/admin/users/${uid}/role`,
      reqBody,
      getAuthHeaders(token)
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};
