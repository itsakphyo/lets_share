// Base API Response
export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  success: boolean;
}

// Error Types
export interface ApiError {
  detail: string;
  status?: number;
}

export interface ValidationError {
  detail: Array<{
    loc: string[];
    msg: string;
    type: string;
  }>;
}

// User Types
export interface UserSummary {
  id: number;
  full_name: string;
  email: string;
}

export interface UserResponse {
  id: number;
  full_name: string;
  email: string;
  created_at: string; // ISO 8601 datetime
  updated_at: string | null; // ISO 8601 datetime or null
}

// Auth Types
export interface SignUpRequest {
  full_name: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface LoginResponse {
  user: UserResponse;
  access_token: string;
  refresh_token: string;
  expires_in: number; // seconds
  token_type: string; // "Bearer"
}

export interface TokenResponse {
  access_token: string;
  token_type: string; // "bearer"
}

// Post Types
export interface PostResponse {
  id: number;
  description: string;
  created_at: string; // ISO 8601 datetime
  updated_at: string | null; // ISO 8601 datetime or null
  author: UserSummary;
}

export interface CreatePostRequest {
  description: string;
}

// API Client Types
export interface ApiClientConfig {
  baseURL: string;
  timeout: number;
  headers?: Record<string, string>;
}

export interface ApiClientOptions {
  skipAuth?: boolean;
  retryCount?: number;
}

// HTTP Methods
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

// Request/Response Types
export interface ApiRequestConfig {
  url: string;
  method: HttpMethod;
  data?: unknown;
  params?: Record<string, unknown>;
  headers?: Record<string, string>;
  options?: ApiClientOptions;
}