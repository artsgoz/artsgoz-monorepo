import { API_BASE_URL } from '@base-components';
/**
 * Public Reader AksornSara API Client
 * Conforms to: AksornSara RESTful API Specification v1.0
 */

export interface PublicArticleItem {
  id: number | string;
  title: string;
  slug: string;
  excerpt: string;
  cover_image_url: string;
  category_name?: string;
  tags?: { id: number; name: string; slug: string }[] | string[];
  author_name: string;
  writer_credit?: string;
  view_count: number;
  published_at: string;
}

export interface PublicArticleDetail extends PublicArticleItem {
  content: string;
  category?: { id: number; name: string; slug: string };
  tags?: { id: number; name: string; slug: string }[];
  proofreader_credit?: string;
  illustrator_credit?: string;
  meta_title?: string;
  meta_description?: string;
}

export interface PublicComment {
  id: number;
  author_name: string;
  content: string;
  created_at: string;
}

const API_BASE =
  (import.meta.env.VITE_AKSORNSARA_API_URL as string) || API_BASE_URL;

async function publicRequest<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  if (!API_BASE) throw new Error('VITE_API_BASE_URL is not configured.');
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...(options.headers as Record<string, string>),
    },
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(
      errorData?.error?.message || `API Error: ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

export const publicArticlesApi = {
  async getArticles(params: {
    page?: number;
    limit?: number;
    category_slug?: string;
    tag_slug?: string;
    search?: string;
  }) {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.category_slug)
      query.append('category_slug', params.category_slug);
    if (params.tag_slug) query.append('tag_slug', params.tag_slug);
    if (params.search) query.append('search', params.search);

    return publicRequest<{
      success: boolean;
      data: PublicArticleItem[];
      pagination: any;
    }>(`/articles?${query.toString()}`);
  },

  async getArticleBySlug(slug: string) {
    const response = await publicRequest<
      PublicArticleDetail | { success: boolean; data: PublicArticleDetail }
    >(`/articles/${encodeURIComponent(slug)}`);
    return {
      success: true,
      data: 'data' in response ? response.data : response,
    };
  },

  async recordView(slug: string) {
    return publicRequest<{
      success: boolean;
      data: { id: number | string; view_count: number };
    }>(`/articles/${encodeURIComponent(slug)}/views`, { method: 'POST' });
  },

  async getComments(slug: string) {
    return publicRequest<{ success: boolean; data: PublicComment[] }>(
      `/articles/${slug}/comments`,
    );
  },

  async postComment(
    slug: string,
    body: { author_name: string; author_email?: string; content: string },
  ) {
    return publicRequest<{ success: boolean; data: any; message: string }>(
      `/articles/${slug}/comments`,
      {
        method: 'POST',
        body: JSON.stringify(body),
      },
    );
  },

  async getCategories() {
    return publicRequest<{
      success: boolean;
      data: { id: number; name: string; slug: string }[];
    }>('/categories');
  },
};
