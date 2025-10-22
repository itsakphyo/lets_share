/**
 * Main App Component
 * Root application component with providers and routing
 */

import { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Box } from '@mui/material';
import { AppHeader } from './components/layout/AppHeader';
import { AppRouter } from './components/layout/AppRouter';
import { initializeStores } from './store';
import './App.css';

function App() {
  // Initialize stores on app startup
  useEffect(() => {
    initializeStores().catch(error => {
      console.error('Failed to initialize stores:', error);
    });
  }, []);

  return (
    <BrowserRouter>
      <Box
        sx={{
          minHeight: '100vh',
          backgroundColor: 'grey.50',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <AppHeader />
        <Box
          component="main"
          sx={{
            flex: 1,
            minHeight: 0,
          }}
        >
          <AppRouter />
        </Box>
      </Box>
    </BrowserRouter>
  );
}

export default App;
