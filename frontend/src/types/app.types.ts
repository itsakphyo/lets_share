import type { UserResponse, PostResponse } from './api.types';

// State Management Types
export interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface PostsState {
  posts: PostResponse[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}