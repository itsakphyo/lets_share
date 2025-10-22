import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Alert,
  Container,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useForm } from '../../../hooks/useForm';
import { useAuth } from '../../../hooks/useAuth';
import { ROUTES } from '../../../config/constants';
import type { SignUpRequest } from '../../../types';

interface SignupFormData {
  full_name: string;
  email: string;
  password: string;
}

const initialValues: SignupFormData = {
  full_name: '',
  email: '',
  password: '',
};

const validationRules = {
  full_name: [{ required: true }],
  email: [{ required: true }],
  password: [{ required: true }],
};

export const SignupForm: React.FC = () => {
  const { signUp, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
  } = useForm<SignupFormData>({
    initialValues,
    validationRules,
    onSubmit: async (formData) => {
      clearError();
      await signUp(formData as SignUpRequest);
    },
  });

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            width: '100%',
            maxWidth: 400,
          }}
        >
          <Typography component="h1" variant="h4" sx={{ mb: 3, fontWeight: 'bold' }}>
            Create Account
          </Typography>

          {error && (
            <Alert severity="error" sx={{ width: '100%', mb: 2 }} data-testid="signup-error">
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1, width: '100%' }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="full_name"
              label="Full Name"
              name="full_name"
              autoComplete="name"
              autoFocus
              placeholder="Enter your full name"
              value={values.full_name}
              onChange={(e) => handleChange('full_name')(e.target.value)}
              onBlur={() => handleBlur('full_name')}
              error={touched.full_name && !!errors.full_name}
              helperText={touched.full_name && errors.full_name}
              disabled={isLoading}
              inputProps={{ 'data-testid': 'signup-fullname' }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              type="email"
              placeholder="Enter your email"
              value={values.email}
              onChange={(e) => handleChange('email')(e.target.value)}
              onBlur={() => handleBlur('email')}
              error={touched.email && !!errors.email}
              helperText={touched.email && errors.email}
              disabled={isLoading}
              inputProps={{ 'data-testid': 'signup-email' }}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              id="password"
              autoComplete="new-password"
              placeholder="Create a password"
              type={showPassword ? 'text' : 'password'}
              value={values.password}
              onChange={(e) => handleChange('password')(e.target.value)}
              onBlur={() => handleBlur('password')}
              error={touched.password && !!errors.password}
              helperText={touched.password && errors.password}
              disabled={isLoading}
              inputProps={{ 'data-testid': 'signup-password' }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={isLoading}
              data-testid="signup-submit"
              sx={{ mt: 3, mb: 2 }}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{' '}
                <Link
                  to={ROUTES.LOGIN}
                  style={{
                    color: 'inherit',
                    textDecoration: 'none',
                    fontWeight: 500,
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default SignupForm;