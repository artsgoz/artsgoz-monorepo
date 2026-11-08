import { apiClient, getAuthHeaders, handleApiError } from './client.js';
import type { ApiResponse, Review } from './types.js';

export const getAdminReviews = async (
  token: string
): Promise<ApiResponse<Review[]>> => {
  try {
    const res = await apiClient.get<ApiResponse<Review[]>>(
      '/admin/reviews',
      getAuthHeaders(token)
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const approveReview = async (
  id: string,
  token: string
): Promise<ApiResponse<never> & { message?: string }> => {
  try {
    const res = await apiClient.put<ApiResponse<never> & { message?: string }>(
      `/admin/reviews/${id}/approve`,
      {},
      getAuthHeaders(token)
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const deleteReview = async (
  id: string,
  token: string
): Promise<ApiResponse<never> & { message?: string }> => {
  try {
    const res = await apiClient.delete<ApiResponse<never> & { message?: string }>(
      `/admin/reviews/${id}`,
      getAuthHeaders(token)
    );
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};
