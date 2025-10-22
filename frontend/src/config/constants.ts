// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  TIMEOUT: 10000,
  ENDPOINTS: {
    AUTH: {
      SIGNUP: '/auth/signup',
      LOGIN: '/auth/login',
      REFRESH: '/auth/refresh',
    },
    POSTS: {
      LIST: '/posts',
      CREATE: '/posts',
      EDIT: (postId: string) => `/posts/${postId}`,
    },
  },
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_DATA: 'user_data',
  THEME_PREFERENCE: 'theme_preference',
} as const;

// Routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FEED: '/feed',
} as const;

// Validation Rules
export const VALIDATION = {
  PASSWORD: {
    MIN_LENGTH: 8,
    MAX_LENGTH: 128,
  },
  POST: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 2000,
  },
  NAME: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
} as const;

// App Metadata
export const APP_CONFIG = {
  NAME: 'Let\'s Share',
  VERSION: '1.0.0',
  DESCRIPTION: 'Social platform for sharing thoughts and ideas',
} as const;