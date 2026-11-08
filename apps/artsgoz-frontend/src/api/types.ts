// Common API response structure
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  detail?: string;
}

export class ApiError extends Error {
  status?: number;
  data?: unknown;
  detail?: string;

  constructor(message: string, status?: number, data?: unknown, detail?: string) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data;
    this.detail = detail;
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

// ==========================================
// 1. User & Auth Module Types
// ==========================================

export interface LoginRequest {
  id_token: string;
}

export interface LoginResponse {
  uid: string;
  role: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  role: string;
}

export interface User {
  firebase_uid: string;
  email: string;
  role: string;
  created_at: string;
  updated_at: string;
}

export interface MeResponse {
  uid: string;
  role: string;
  message: string;
}

export interface AdminDashboardResponse {
  message: string;
  role: string;
}

export interface UpdateUserRoleRequest {
  role: string;
}

// ==========================================
// 2. FAQ Module Types
// ==========================================

export interface ListFAQsInput {
  tag?: string;
  q?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  tags?: string[];
  sortOrder?: number;
}

export interface CreateFAQInput {
  question: string;
  answer: string;
  tags?: string[];
  sortOrder?: number;
}

export interface CreateFAQOutput {
  id: string;
}

// ==========================================
// 3. Contact Module Types
// ==========================================

export interface SubmitContactInput {
  name: string;
  studentId?: string;
  email: string;
  category: string;
  message: string;
}

export interface SubmitContactOutput {
  id: string;
}

export interface ContactItem {
  id: string;
  name: string;
  studentId?: string;
  email: string;
  category: string;
  message: string;
  status: string;
  reply: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReplyContactInput {
  status: string;
  reply?: string;
}

// ==========================================
// 4. Review Module Types
// ==========================================

export interface Review {
  id: string;
  company: string;
  role: string;
  content: string;
  author: string;
  date: string;
  status: string;
  created_at: string;
  updated_at: string;
}
