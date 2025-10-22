import React from 'react';
import { Box } from '@mui/material';
import { SignupForm } from '../components/features/auth/SignupForm';

export const SignupPage: React.FC = () => {
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
      <SignupForm />
    </Box>
  );
};

export default SignupPage;