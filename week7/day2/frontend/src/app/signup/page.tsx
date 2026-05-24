'use client';
import { Box, Typography, Button, Container, Chip } from '@mui/material';
import GoogleIcon from '@mui/icons-material/Google';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutlined';
import Image from 'next/image';
import Link from 'next/link';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

const perks = [
  'Access real-time market trends',
  'Manage your crypto portfolio',
  'Secure blockchain transactions',
  'Exclusive newsletter updates',
];

export default function SignupPage() {
  const handleGoogleSignup = () => {
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
          inset: 0,
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
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 3 }}>
            <Image src="/assets/Logo.png" alt="Circlechain" width={180} height={180} style={{ objectFit: 'contain' }} />
          </Box>

          <Typography variant="h4" sx={{ color: '#fff', fontWeight: 700, textAlign: 'center', mb: 0.5 }}>
            Get Started
          </Typography>
          <Typography sx={{ color: '#9CA3AF', textAlign: 'center', fontSize: '14px', mb: 3 }}>
            Create your account to start trading blockchain assets
          </Typography>

          {/* Perks */}
          <Box sx={{ mb: 3 }}>
            {perks.map((perk) => (
              <Box key={perk} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CheckCircleOutlineIcon sx={{ color: '#00E676', fontSize: 18 }} />
                <Typography sx={{ color: '#9CA3AF', fontSize: '13px' }}>{perk}</Typography>
              </Box>
            ))}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: '#1a2332' }} />
            <Typography sx={{ color: '#6B7280', fontSize: '12px' }}>Sign up with</Typography>
            <Box sx={{ flex: 1, height: '1px', backgroundColor: '#1a2332' }} />
          </Box>

          <Button
            id="google-signup-btn"
            fullWidth
            variant="contained"
            size="large"
            startIcon={<GoogleIcon />}
            onClick={handleGoogleSignup}
            sx={{
              backgroundColor: '#00E676',
              color: '#000',
              py: 1.5,
              fontSize: '15px',
              fontWeight: 700,
              mb: 3,
              '&:hover': { backgroundColor: '#00c764' },
            }}
          >
            Continue with Google
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography sx={{ color: '#6B7280', fontSize: '13px' }}>
              Already have an account?{' '}
              <Typography
                component={Link}
                href="/login"
                sx={{ color: '#00E676', textDecoration: 'none', fontWeight: 600, '&:hover': { textDecoration: 'underline' } }}
              >
                Log In
              </Typography>
            </Typography>
          </Box>

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
