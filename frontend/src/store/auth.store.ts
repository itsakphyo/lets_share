/**
 * Authentication Store
 * Zustand store for managing authentication state
 */

import { create } from 'zustand';
import { authService } from '../services/api';
import type { 
  AuthState, 
  SignUpRequest, 
  LoginRequest, 
  UserResponse,
  ApiError 
} from '../types';

interface AuthActions {
  // Authentication actions
  signUp: (userData: SignUpRequest) => Promise<UserResponse>;
  login: (credentials: LoginRequest) => Promise<UserResponse>;
  logout: () => void;
  refreshAuth: () => Promise<void>;
  
  // State management actions
  setUser: (user: UserResponse | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  
  // Utility actions
  initialize: () => Promise<void>;
  reset: () => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthStore>()((set, get) => ({
  ...initialState,

  // Authentication actions
  signUp: async (userData: SignUpRequest): Promise<UserResponse> => {
        set({ isLoading: true, error: null });
        
        try {
          const user = await authService.signUp(userData);
          
          set({
            isLoading: false,
            error: null,
          });
          
          return user;
        } catch (error) {
          const apiError = error as ApiError;
          set({
            isLoading: false,
            error: apiError.detail,
          });
          throw error;
        }
      },

      login: async (credentials: LoginRequest): Promise<UserResponse> => {
        set({ isLoading: true, error: null });
        
        try {
          const response = await authService.login(credentials);
          
          // Store user data
          authService.setCurrentUser(response.user);
          
          set({
            user: response.user,
            accessToken: response.access_token,
            refreshToken: response.refresh_token,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          
          return response.user;
        } catch (error) {
          const apiError = error as ApiError;
          set({
            isLoading: false,
            error: apiError.detail,
            isAuthenticated: false,
          });
          throw error;
        }
      },

      logout: () => {
        authService.logout();
        authService.clearCurrentUser();
        
        set({
          ...initialState,
        });
      },

      refreshAuth: async (): Promise<void> => {
        const { refreshToken } = get();
        
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        try {
          const response = await authService.refreshToken(refreshToken);
          
          set({
            accessToken: response.access_token,
            error: null,
          });
        } catch (error) {
          // If refresh fails, logout user
          get().logout();
          throw error;
        }
      },

      // State management actions
      setUser: (user: UserResponse | null) => {
        set({
          user,
          isAuthenticated: !!user,
        });
      },

      setLoading: (isLoading: boolean) => {
        set({ isLoading });
      },

      setError: (error: string | null) => {
        set({ error });
      },

      clearError: () => {
        set({ error: null });
      },

      // Utility actions
      initialize: async (): Promise<void> => {
        set({ isLoading: true });
        
        try {
          // Check if user is authenticated
          const isAuthenticated = authService.isAuthenticated();
          const userData = authService.getCurrentUser();
          
          if (isAuthenticated && userData) {
            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            });
          } else {
            set({
              ...initialState,
              isLoading: false,
            });
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          set({
            ...initialState,
            isLoading: false,
          });
        }
      },

      reset: () => {
        set(initialState);
      },
    }));

// Selectors for convenient access to specific state slices
export const useAuthActions = () => useAuthStore((state) => ({
  signUp: state.signUp,
  login: state.login,
  logout: state.logout,
  refreshAuth: state.refreshAuth,
  setError: state.setError,
  clearError: state.clearError,
  initialize: state.initialize,
}));