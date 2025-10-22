import React from 'react';
import { Link } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { ExitToApp } from '@mui/icons-material';
import { useAuth } from '../../hooks/useAuth';
import { APP_CONFIG, ROUTES } from '../../config/constants';

export const AppHeader: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <AppBar position="sticky" elevation={1} sx={{ bgcolor: 'background.paper', color: 'text.primary' }}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        {/* Logo */}
        <Typography
          variant="h5"
          component={Link}
          to={isAuthenticated ? ROUTES.FEED : ROUTES.HOME}
          sx={{
            fontWeight: 700,
            color: 'primary.main',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            '&:hover': {
              color: 'primary.dark',
            },
          }}
        >
          {APP_CONFIG.NAME}
        </Typography>

        {/* Navigation */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {isAuthenticated && user ? (
            <Button
              onClick={handleLogout}
              variant="outlined"
              size="small"
              startIcon={<ExitToApp />}
              data-testid="logout-button"
            >
              Sign Out
            </Button>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                component={Link}
                to={ROUTES.LOGIN}
                variant="outlined"
                size="small"
              >
                Sign In
              </Button>
              <Button
                component={Link}
                to={ROUTES.SIGNUP}
                variant="outlined"
                size="small"
              >
                Sign Up
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default AppHeader;