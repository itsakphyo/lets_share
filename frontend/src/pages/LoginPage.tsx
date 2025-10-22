import React from 'react';
import { Box } from '@mui/material';
import { LoginForm } from '../components/features/auth/LoginForm';

export const LoginPage: React.FC = () => {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'grey.50',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
      }}
    >
      <LoginForm />
    </Box>
  );
};

export default LoginPage;