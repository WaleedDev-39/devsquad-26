'use client';
import { Box, Typography, Container, TextField, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useSubscribeMutation } from '@/services/api/newsletterApi';

export default function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: 'success' | 'error' }>({
    open: false, message: '', severity: 'success',
  });

  const [subscribe, { isLoading }] = useSubscribeMutation();

  const handleSubscribe = async () => {
    if (!email.trim()) {
      setSnackbar({ open: true, message: 'Please enter your email address.', severity: 'error' });
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setSnackbar({ open: true, message: 'Please enter a valid email address.', severity: 'error' });
      return;
    }

    try {
      const result = await subscribe({ email }).unwrap();
      setSnackbar({ open: true, message: result.message, severity: 'success' });
      setEmail('');
    } catch (err: any) {
      const msg = err?.data?.message || 'Something went wrong. Please try again.';
      setSnackbar({ open: true, message: msg, severity: 'error' });
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#070B0E',
        position: 'relative',
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            background: '#0B1116',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '0 0 100px rgba(0, 230, 118, 0.15)',
            borderRadius: '16px',
            p: { xs: 4, md: 8 },
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="h3"
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: '1.4rem', md: '1.8rem' },
              mb: 4,
              position: 'relative',
            }}
          >
            Want to be aware of all update
          </Typography>

          <Box
            sx={{
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'row' },
              justifyContent: 'center',
              alignItems: 'stretch',
              gap: { xs: 2.5, sm: 2 },
              maxWidth: 550,
              mx: 'auto',
              position: 'relative',
            }}
          >
            <TextField
              id="newsletter-email-input"
              placeholder="Enter your email address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
              fullWidth
              sx={{
                bgcolor: '#fff',
                borderRadius: '8px',
                '& .MuiOutlinedInput-root': {
                  borderRadius: '8px',
                  height: '48px',
                  '& fieldset': { border: 'none' },
                },
                '& input': { 
                  color: '#000', 
                  '&::placeholder': { color: '#6B7280', opacity: 1, fontSize: '14px' } 
                },
              }}
            />
            <Button
              id="newsletter-subscribe-btn"
              variant="contained"
              onClick={handleSubscribe}
              disabled={isLoading}
              sx={{
                bgcolor: '#6EE79E',
                color: '#000',
                fontWeight: 700,
                fontSize: '15px',
                textTransform: 'none',
                height: '48px',
                px: 4,
                borderRadius: '8px',
                whiteSpace: 'nowrap',
                minWidth: 140,
                boxShadow: 'none',
                '&:hover': { bgcolor: '#5CD58C', boxShadow: 'none' },
              }}
            >
              {isLoading ? <CircularProgress size={20} sx={{ color: '#000' }} /> : 'Subscribe'}
            </Button>
          </Box>
        </Box>
      </Container>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
