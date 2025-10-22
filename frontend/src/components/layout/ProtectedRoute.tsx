import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useRequireAuth } from '../../hooks/useAuth';
import { ROUTES } from '../../config/constants';
import type { ProtectedRouteProps } from '../../types/app.types';

const LoadingSpinner: React.FC = () => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      flexDirection: 'column',
      gap: 3,
      bgcolor: 'background.default',
    }}
  >
    <CircularProgress size={40} thickness={4} />
    <Typography variant="body1" color="text.secondary">
      Loading...
    </Typography>
  </Box>
);

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  redirectTo = ROUTES.LOGIN,
}) => {
  const location = useLocation();
  const { isAuthenticated, isLoading } = useRequireAuth(redirectTo);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  // Render children if authenticated
  return <>{children}</>;
};

export default ProtectedRoute;