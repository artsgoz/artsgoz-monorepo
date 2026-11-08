/**
 * AksornSara API Client
 * Conforms to: AksornSara RESTful API Specification v1.0
 */

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: {
    code: string;
    message: string;
    details?: { field: string; issue: string }[];
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total_records: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: PaginationMeta;
}

export interface ArticleDto {
  id: number | string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  cover_image_url: string;
  status: 'draft' | 'published' | 'archived';
  category_id?: number;
  category_name?: string;
  tags?: Array<{ id: number; name: string; slug: string }> | string[];
  author_name: string;
  writer_credit?: string;
  proofreader_credit?: string;
  illustrator_credit?: string;
  view_count: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface DashboardStatsDto {
  total_views: number;
  published_articles: number;
  draft_articles: number;
  pending_comments: number;
  total_categories: number;
}

export interface MonthlyTrendDto {
  month: string;
  label: string;
  views: number;
}

export interface TopArticleDto {
  id: number;
  title: string;
  slug: string;
  view_count: number;
  published_at: string;
}

const API_BASE = (import.meta.env.VITE_AKSORNSARA_API_URL as string) || 'http://localhost:3000/api/v1';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

  const token = typeof window !== 'undefined' ? localStorage.getItem('firebase_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData?.error?.message || `API Error: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<T>;
}

export const aksornsaraApi = {
  // ─── ARTICLES (BACKOFFICE) ──────────────────────────────────
  async getArticles(params: {
    page?: number;
    limit?: number;
    status?: string;
    category_id?: number | string;
    search?: string;
    sort_by?: string;
    order?: 'asc' | 'desc';
  }): Promise<PaginatedResponse<ArticleDto>> {
    const query = new URLSearchParams();
    if (params.page) query.append('page', String(params.page));
    if (params.limit) query.append('limit', String(params.limit));
    if (params.status) query.append('status', params.status);
    if (params.category_id) query.append('category_id', String(params.category_id));
    if (params.search) query.append('search', params.search);
    if (params.sort_by) query.append('sort_by', params.sort_by);
    if (params.order) query.append('order', params.order);

    return request<PaginatedResponse<ArticleDto>>(`/admin/articles?${query.toString()}`);
  },

  async getArticleById(id: number | string): Promise<ApiResponse<ArticleDto>> {
    return request<ApiResponse<ArticleDto>>(`/admin/articles/${id}`);
  },

  async createArticle(data: Partial<ArticleDto>): Promise<ApiResponse<{ id: number; title: string; slug: string; status: string }>> {
    return request<ApiResponse<{ id: number; title: string; slug: string; status: string }>>('/admin/articles', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateArticle(id: number | string, data: Partial<ArticleDto>): Promise<ApiResponse<{ id: number; updated_at: string }>> {
    return request<ApiResponse<{ id: number; updated_at: string }>>(`/admin/articles/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async updateArticleStatus(id: number | string, status: 'published' | 'draft' | 'archived'): Promise<ApiResponse<{ id: number; status: string }>> {
    return request<ApiResponse<{ id: number; status: string }>>(`/admin/articles/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async deleteArticle(id: number | string): Promise<ApiResponse<null>> {
    return request<ApiResponse<null>>(`/admin/articles/${id}`, {
      method: 'DELETE',
    });
  },

  // ─── DASHBOARD ──────────────────────────────────────────────
  async getDashboardStats(): Promise<ApiResponse<DashboardStatsDto>> {
    return request<ApiResponse<DashboardStatsDto>>('/admin/dashboard/stats');
  },

  async getMonthlyTrends(year?: number): Promise<ApiResponse<MonthlyTrendDto[]>> {
    return request<ApiResponse<MonthlyTrendDto[]>>(`/admin/dashboard/monthly-trends${year ? `?year=${year}` : ''}`);
  },

  async getTopArticles(limit = 5): Promise<ApiResponse<TopArticleDto[]>> {
    return request<ApiResponse<TopArticleDto[]>>(`/admin/dashboard/top-articles?limit=${limit}`);
  },

  // ─── CATEGORIES & TAGS ──────────────────────────────────────
  async getCategories(): Promise<ApiResponse<{ id: number; name: string; slug: string; article_count?: number }[]>> {
    return request<ApiResponse<{ id: number; name: string; slug: string; article_count?: number }[]>>('/admin/categories');
  },

  async getTags(search?: string): Promise<ApiResponse<{ id: number; name: string; slug: string }[]>> {
    return request<ApiResponse<{ id: number; name: string; slug: string }[]>>(`/admin/tags${search ? `?search=${encodeURIComponent(search)}` : ''}`);
  },

  // ─── MEDIA UPLOAD ───────────────────────────────────────────
  async uploadMedia(file: File | { url: string }): Promise<ApiResponse<{ url: string; file_name: string }>> {
    if ('url' in file) {
      return request<ApiResponse<{ url: string; file_name: string }>>('/admin/media/upload', {
        method: 'POST',
        body: JSON.stringify({ url: file.url }),
      });
    }

    const formData = new FormData();
    formData.append('file', file);
    return request<ApiResponse<{ url: string; file_name: string }>>('/admin/media/upload', {
      method: 'POST',
      body: formData,
      headers: {}, // let browser set boundary
    });
  },

  // ─── COMMENTS ───────────────────────────────────────────────
  async getComments(status?: string, page = 1, limit = 20): Promise<PaginatedResponse<any>> {
    const q = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (status) q.append('status', status);
    return request<PaginatedResponse<any>>(`/admin/comments?${q.toString()}`);
  },

  async updateCommentStatus(id: number | string, status: 'approved' | 'rejected' | 'spam'): Promise<ApiResponse<any>> {
    return request<ApiResponse<any>>(`/admin/comments/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },
};

