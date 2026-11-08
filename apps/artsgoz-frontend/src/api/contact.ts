import { apiClient, getAuthHeaders, handleApiError } from './client.js';
import type {
  ApiResponse,
  ContactItem,
  ReplyContactInput,
  SubmitContactInput,
  SubmitContactOutput,
} from './types.js';

export const submitContact = async (
  data: SubmitContactInput
): Promise<ApiResponse<SubmitContactOutput>> => {
  try {
    const res = await apiClient.post<ApiResponse<SubmitContactOutput>>('/contacts', data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const getAdminContacts = async (
  token: string
): Promise<ApiResponse<ContactItem[]>> => {
  try {
    const res = await apiClient.get<ApiResponse<ContactItem[]>>(
      '/admin/contacts',
      getAuthHeaders(token)
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const updateContactStatus = async (
  id: string,
  data: ReplyContactInput,
  token: string
): Promise<ApiResponse<never> & { message?: string }> => {
  try {
    const res = await apiClient.put<ApiResponse<never> & { message?: string }>(
      `/admin/contacts/${id}`,
      data,
      getAuthHeaders(token)
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};
