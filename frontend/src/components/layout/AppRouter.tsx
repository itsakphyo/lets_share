import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { LoginPage } from '../../pages/LoginPage';
import { SignupPage } from '../../pages/SignupPage';
import { FeedPage } from '../../pages/FeedPage';
import { ROUTES } from '../../config/constants';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      {/* Public Routes - Redirect to feed if authenticated */}
      <Route
        path={ROUTES.LOGIN}
        element={
          <PublicRoute>
            <LoginPage />
          </PublicRoute>
        }
      />
      
      <Route
        path={ROUTES.SIGNUP}
        element={
          <PublicRoute>
            <SignupPage />
          </PublicRoute>
        }
      />

      {/* Protected Routes - Require authentication */}
      <Route
        path={ROUTES.FEED}
        element={
          <ProtectedRoute>
            <FeedPage />
          </ProtectedRoute>
        }
      />

      {/* Default redirect */}
      <Route
        path={ROUTES.HOME}
        element={<Navigate to={ROUTES.FEED} replace />}
      />

      {/* Catch all route - redirect to feed */}
      <Route
        path="*"
        element={<Navigate to={ROUTES.FEED} replace />}
      />
    </Routes>
  );
};

export default AppRouter;