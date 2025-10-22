import { apiClient } from './client';
import { API_CONFIG } from '../../config/constants';
import type {
  SignUpRequest,
  LoginRequest,
  RefreshTokenRequest,
  UserResponse,
  LoginResponse,
  TokenResponse,
} from '../../types/api.types';

export class AuthService {
  /**
   * Sign up a new user
   */
  async signUp(userData: SignUpRequest): Promise<UserResponse> {
    try {
      const response = await apiClient.post<UserResponse>(
        API_CONFIG.ENDPOINTS.AUTH.SIGNUP,
        userData
      );
      return response;
    } catch (error) {
      throw apiClient.handleError(error);
    }
  }

  /**
   * Login user and get tokens
   */
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await apiClient.post<LoginResponse>(
        API_CONFIG.ENDPOINTS.AUTH.LOGIN,
        credentials
      );

      // Store tokens in the client
      apiClient.setTokens(response.access_token, response.refresh_token);

      return response;
    } catch (error) {
      throw apiClient.handleError(error);
    }
  }

  /**
   * Refresh access token
   */
  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    try {
      const response = await apiClient.post<TokenResponse>(
        API_CONFIG.ENDPOINTS.AUTH.REFRESH,
        { refresh_token: refreshToken } as RefreshTokenRequest
      );

      return response;
    } catch (error) {
      throw apiClient.handleError(error);
    }
  }

  /**
   * Logout user (client-side cleanup)
   */
  logout(): void {
    apiClient.logout();
  }

  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  /**
   * Get current user data from localStorage
   */
  getCurrentUser(): UserResponse | null {
    try {
      const userData = localStorage.getItem('user_data');
      return userData ? JSON.parse(userData) : null;
    } catch {
      return null;
    }
  }

  /**
   * Store user data in localStorage
   */
  setCurrentUser(user: UserResponse): void {
    localStorage.setItem('user_data', JSON.stringify(user));
  }

  /**
   * Clear user data from localStorage
   */
  clearCurrentUser(): void {
    localStorage.removeItem('user_data');
  }
}

// Create singleton instance
export const authService = new AuthService();
export default authService;