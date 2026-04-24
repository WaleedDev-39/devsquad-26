'use client';
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00E676',
      contrastText: '#000000',
    },
    secondary: {
      main: '#1a2332',
    },
    background: {
      default: '#070B0E',
      paper: '#0D1117',
    },
    text: {
      primary: '#ffffff',
      secondary: '#9CA3AF',
    },
    success: {
      main: '#00E676',
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 800,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
        containedPrimary: {
          backgroundColor: '#00E676',
          color: '#000000',
          '&:hover': {
            backgroundColor: '#00c764',
          },
        },
        outlinedPrimary: {
          borderColor: '#00E676',
          color: '#00E676',
          '&:hover': {
            borderColor: '#00c764',
            backgroundColor: 'rgba(0,230,118,0.08)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: '#0D1117',
          border: '1px solid #1a2332',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255,255,255,0.05)',
            '& fieldset': {
              borderColor: 'rgba(255,255,255,0.1)',
            },
            '&:hover fieldset': {
              borderColor: '#00E676',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00E676',
            },
          },
        },
      },
    },
  },
});

export default theme;
