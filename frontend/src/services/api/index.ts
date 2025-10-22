export { apiClient, default as client } from './client';
export { authService, AuthService, default as auth } from './auth.service';
export { postsService, PostsService, default as posts } from './posts.service';

// Re-export commonly used types
export type {
  ApiError,
  SignUpRequest,
  LoginRequest,
  LoginResponse,
  TokenResponse,
  PostResponse,
  CreatePostRequest,
  UserResponse,
} from '../../types/api.types';