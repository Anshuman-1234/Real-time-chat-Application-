import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { CssBaseline, createTheme, ThemeProvider } from '@mui/material';
const theme = createTheme({
  palette: {
    primary: {
      main: '#075e54',  
      light: '#DCF8C6',  
      contrastText: '#fff',  
    },
    secondary: {
      main: '#007bff',  
    },
    background: {
      default: '#e5ddd5',  
      paper: '#ffffff',  
    },
    text: {
      primary: '#262626',  
      secondary: '#666',  
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      'Arial',
      'sans-serif',
    ].join(','),
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          textTransform: 'none',
          boxShadow: 'none',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <App />
  </ThemeProvider>
);