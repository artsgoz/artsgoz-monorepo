import { apiClient, handleApiError } from './client.js';
import type {
  ApiResponse,
  CreateFAQInput,
  CreateFAQOutput,
  FAQItem,
  ListFAQsInput,
} from './types.js';

export const getFaqs = async (params?: ListFAQsInput): Promise<ApiResponse<FAQItem[]>> => {
  try {
    const res = await apiClient.get<ApiResponse<FAQItem[]>>('/faqs', { params });
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};

export const createFaq = async (data: CreateFAQInput): Promise<ApiResponse<CreateFAQOutput>> => {
  try {
    const res = await apiClient.post<ApiResponse<CreateFAQOutput>>('/faqs', data);
    return res.data;
  } catch (error) {
    return handleApiError(error);
  }
};
