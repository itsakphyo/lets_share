import React from 'react';
import { Navigate } from 'react-router-dom';
import { Box, CircularProgress, Typography } from '@mui/material';
import { useRequireGuest } from '../../hooks/useAuth';
import { ROUTES } from '../../config/constants';
import type { PublicRouteProps } from '../../types/app.types';

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

export const PublicRoute: React.FC<PublicRouteProps> = ({
  children,
  redirectTo = ROUTES.FEED,
}) => {
  const { isAuthenticated, isLoading } = useRequireGuest(redirectTo);

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to feed if already authenticated
  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render children if not authenticated
  return <>{children}</>;
};

export default PublicRoute;