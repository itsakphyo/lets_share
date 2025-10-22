import { useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store';
import { ROUTES } from '../config/constants';
import type { SignUpRequest, LoginRequest } from '../types';

interface UseAuthReturn {
  // State
  user: any; // Will be typed properly from store
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  signUp: (userData: SignUpRequest) => Promise<void>;
  login: (credentials: LoginRequest) => Promise<void>;
  logout: () => void;
  clearError: () => void;
  
  // Utilities
  redirectTo: (path: string) => void;
}

export const useAuth = (): UseAuthReturn => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Use stable selectors to avoid infinite loops
  const user = useAuthStore(state => state.user);
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const error = useAuthStore(state => state.error);
  const initialize = useAuthStore(state => state.initialize);
  const signUpAction = useAuthStore(state => state.signUp);
  const loginAction = useAuthStore(state => state.login);
  const logoutAction = useAuthStore(state => state.logout);
  const clearErrorAction = useAuthStore(state => state.clearError);

  // Initialize auth on mount
  useEffect(() => {
    void initialize();
  }, [initialize]);

  // Enhanced sign up with redirect
  const signUp = useCallback(async (userData: SignUpRequest): Promise<void> => {
    try {
      await signUpAction(userData);
      // After successful signup, redirect to login
      navigate(ROUTES.LOGIN, { 
        state: { message: 'Account created successfully! Please log in.' }
      });
    } catch (error) {
      // Error is handled by the store
      throw error;
    }
  }, [signUpAction, navigate]);

  // Enhanced login with redirect
  const login = useCallback(async (credentials: LoginRequest): Promise<void> => {
    try {
      await loginAction(credentials);
      
      // Redirect to intended page or dashboard
      const from = location.state?.from?.pathname || ROUTES.FEED;
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the store
      throw error;
    }
  }, [loginAction, navigate, location]);

  // Enhanced logout with redirect
  const logout = useCallback(() => {
    logoutAction();
    navigate(ROUTES.LOGIN, { replace: true });
  }, [logoutAction, navigate]);

  // Utility functions
  const redirectTo = useCallback((path: string) => {
    navigate(path);
  }, [navigate]);

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    
    // Actions
    signUp,
    login,
    logout,
    clearError: clearErrorAction,
    
    // Utilities
    redirectTo,
  };
};

// Hook for checking authentication requirements
export const useRequireAuth = (redirectTo: string = ROUTES.LOGIN) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate(redirectTo, {
        state: { from: location },
        replace: true,
      });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo, location]);

  return { isAuthenticated, isLoading };
};

// Hook for preventing authenticated users from accessing public routes
export const useRequireGuest = (redirectTo: string = ROUTES.FEED) => {
  const isAuthenticated = useAuthStore(state => state.isAuthenticated);
  const isLoading = useAuthStore(state => state.isLoading);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate(redirectTo, { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate, redirectTo]);

  return { isAuthenticated, isLoading };
};