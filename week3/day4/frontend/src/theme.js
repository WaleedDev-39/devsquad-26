import { createTheme } from '@mui/material/styles';

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      ...(mode === 'dark'
        ? {
            primary: { main: '#7c4dff', light: '#b47cff', dark: '#3f1dcb' },
            secondary: { main: '#00e5ff', light: '#6effff', dark: '#00b2cc' },
            background: {
              default: '#0a0e1a',
              paper: '#111827',
            },
            text: { primary: '#e2e8f0', secondary: '#94a3b8' },
            success: { main: '#22c55e' },
            warning: { main: '#f59e0b' },
            error: { main: '#ef4444' },
            divider: 'rgba(148, 163, 184, 0.12)',
          }
        : {
            primary: { main: '#6c3ce0', light: '#9d6fff', dark: '#4a0fb0' },
            secondary: { main: '#0891b2', light: '#22d3ee', dark: '#065f7c' },
            background: {
              default: '#f0f4f8',
              paper: '#ffffff',
            },
            text: { primary: '#1e293b', secondary: '#64748b' },
            success: { main: '#16a34a' },
            warning: { main: '#d97706' },
            error: { main: '#dc2626' },
            divider: 'rgba(30, 41, 59, 0.12)',
          }),
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica Neue", Arial, sans-serif',
      h1: { fontWeight: 800, letterSpacing: '-0.02em' },
      h2: { fontWeight: 700, letterSpacing: '-0.01em' },
      h3: { fontWeight: 700 },
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
      button: { fontWeight: 600, textTransform: 'none' },
    },
    shape: { borderRadius: 16 },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 12,
            padding: '10px 24px',
            fontSize: '0.95rem',
            boxShadow: 'none',
            '&:hover': { boxShadow: 'none' },
          },
          contained: {
            background: mode === 'dark'
              ? 'linear-gradient(135deg, #7c4dff 0%, #448aff 100%)'
              : 'linear-gradient(135deg, #6c3ce0 0%, #3b82f6 100%)',
            '&:hover': {
              background: mode === 'dark'
                ? 'linear-gradient(135deg, #651fff 0%, #2979ff 100%)'
                : 'linear-gradient(135deg, #5b2dd0 0%, #2563eb 100%)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: 20,
            border: mode === 'dark'
              ? '1px solid rgba(124, 77, 255, 0.15)'
              : '1px solid rgba(0,0,0,0.06)',
            background: mode === 'dark'
              ? 'linear-gradient(145deg, rgba(17,24,39,0.9) 0%, rgba(30,41,59,0.6) 100%)'
              : '#ffffff',
            backdropFilter: 'blur(20px)',
            boxShadow: mode === 'dark'
              ? '0 8px 32px rgba(0,0,0,0.3)'
              : '0 4px 20px rgba(0,0,0,0.06)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 24,
            background: mode === 'dark'
              ? 'linear-gradient(145deg, #111827 0%, #1e293b 100%)'
              : '#ffffff',
            border: mode === 'dark'
              ? '1px solid rgba(124, 77, 255, 0.2)'
              : '1px solid rgba(0,0,0,0.08)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: mode === 'dark'
              ? 'rgba(10, 14, 26, 0.8)'
              : 'rgba(255, 255, 255, 0.8)',
            backdropFilter: 'blur(20px)',
            borderBottom: mode === 'dark'
              ? '1px solid rgba(124, 77, 255, 0.15)'
              : '1px solid rgba(0,0,0,0.08)',
            boxShadow: 'none',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 500 },
        },
      },
    },
  });
