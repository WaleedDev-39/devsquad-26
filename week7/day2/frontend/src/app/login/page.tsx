'use client';
import {
  Box, Typography, Button, Container, CircularProgress,
} from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: '#070B0E',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(0,230,118,0.08) 0%, transparent 70%)',
        },
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0D1117 0%, #111827 100%)',
            border: '1px solid #1a2332',
            borderRadius: '20px',
            p: { xs: 4, md: 5 },
            position: 'relative',
            zIndex: 1,
            animation: 'fadeInUp 0.5s ease forwards',
          }}
        >
          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 4 }}>
            <Image src="/assets/Logo.png" alt="Circlechain" width={180} height={180} style={{ objectFit: 'contain' }} />
          </Box>

          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', mb: 1 }}>
            Welcome Back
          </Typography>
          <Typography sx={{ color: '#9CA3AF', textAlign: 'center', fontSize: '14px', mb: 4 }}>
            Sign in to manage your blockchain assets
          </Typography>

          {/* Divider */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: '#1a2332' }} />
            <Typography sx={{ color: '#6B7280', fontSize: '12px' }}>Continue with</Typography>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: '#1a2332' }} />
          </Box>

          {/* Google SSO */}
          <Button
            id="google-login-btn"
            fullWidth
            variant="outlined"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleLogin}
            sx={{
              borderColor: '#1a2332',
              color: '#fff',
              py: 1.5,
              fontSize: '15px',
              fontWeight: 600,
              backgroundColor: 'rgba(255,255,255,0.03)',
              mb: 3,
              '&:hover': {
                borderColor: '#00E676',
                backgroundColor: 'rgba(0,230,118,0.05)',
                color: '#00E676',
              },
            }}
          >
            Continue with Google
          </Button>

          {/* Footer links */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: '#6B7280', fontSize: '13px' }}>
              Don't have an account?{' '}
              <Typography
                component={Link}
                href="/signup"
                sx={{ color: '#00E676', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
              >
                Sign Up
              </Typography>
            </Typography>
          </Box>

          {/* Back to home */}
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography
              component={Link}
              href="/"
              sx={{ color: '#4B5563', fontSize: '12px', textDecoration: 'none', '&:hover': { color: '#9CA3AF' } }}
            >
              ← Back to home
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
