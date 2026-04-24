'use client';
import { useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials, restoreSession } from '@/services/authSlice';
import { RootState } from '@/services/store';
import {
  Box, Typography, Container, Grid, Card, CardContent,
  Avatar, Button, Chip, CircularProgress, Divider,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import Navbar from '@/components/Navbar';
import CryptoCard from '@/components/CryptoCard';
import Footer from '@/components/Footer';
import Link from 'next/link';

const portfolioItems = [
  { icon: 'bitcoin_img.png', ticker: 'BTC', name: 'Bitcoin', price: '$56,623.54', change: '1.41%', amount: '0.0842 BTC', value: '$4,768.34' },
  { icon: 'etherium_img.png', ticker: 'ETH', name: 'Ethereum', price: '$4,267.90', change: '2.22%', amount: '1.24 ETH', value: '$5,292.20' },
  { icon: 'bnb_img.png', ticker: 'BNB', name: 'BNB', price: '$587.74', change: '0.82%', amount: '3.5 BNB', value: '$2,057.09' },
  { icon: 'usdt_img.png', ticker: 'USDT', name: 'Tether', price: '$0.9998', change: '0.03%', amount: '500 USDT', value: '$499.90' },
];

const stats = [
  { label: 'Total Portfolio', value: '$12,617.53', icon: <AccountBalanceWalletIcon />, color: '#00E676' },
  { label: 'Today\'s Gain', value: '+$243.80', icon: <TrendingUpIcon />, color: '#00E676' },
  { label: 'Total Trades', value: '47', icon: <SwapHorizIcon />, color: '#3B82F6' },
];

function DashboardContent() {
  const searchParams = useSearchParams();
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    // Handle OAuth callback
    const token = searchParams.get('token');
    const userParam = searchParams.get('user');
    if (token && userParam) {
      try {
        const parsedUser = JSON.parse(decodeURIComponent(userParam));
        dispatch(setCredentials({ token, user: parsedUser }));
        // Clean URL
        window.history.replaceState({}, '', '/dashboard');
      } catch {}
    } else {
      dispatch(restoreSession());
    }
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (!isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem('circlechain_token');
      if (!token) {
        router.push('/login');
      }
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#070B0E' }}>
        <CircularProgress sx={{ color: '#00E676' }} />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box sx={{ minHeight: '100vh', backgroundColor: '#070B0E', pt: 10, pb: 6 }}>
        <Container maxWidth="lg">
          {/* Welcome Header */}
          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Avatar src={user?.avatar} alt={user?.name} sx={{ width: 52, height: 52, border: '2px solid #00E676' }} />
              <Box>
                <Typography sx={{ color: '#9CA3AF', fontSize: '13px' }}>Welcome back,</Typography>
                <Typography variant="h5" sx={{ color: '#fff', fontWeight: 700 }}>
                  {user?.displayName || user?.name}
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Stats Row */}
          <Grid container spacing={3} sx={{ mb: 5 }}>
            {stats.map((stat) => (
              <Grid size={{ xs: 12, sm: 4 }} key={stat.label}>
                <Card sx={{ background: 'linear-gradient(135deg, #0D1117, #111827)', border: '1px solid #1a2332', borderRadius: '16px', p: 1 }}>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
                      <Typography sx={{ color: '#9CA3AF', fontSize: '13px' }}>{stat.label}</Typography>
                      <Box sx={{ color: stat.color, opacity: 0.8 }}>{stat.icon}</Box>
                    </Box>
                    <Typography sx={{ color: '#fff', fontWeight: 800, fontSize: '1.6rem' }}>{stat.value}</Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Portfolio */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>Your Portfolio</Typography>
            <Box sx={{ background: 'linear-gradient(135deg, #0D1117, #111827)', border: '1px solid #1a2332', borderRadius: '16px', overflow: 'hidden' }}>
              {portfolioItems.map((item, idx) => (
                <Box key={idx}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', p: 2.5, '&:hover': { backgroundColor: 'rgba(255,255,255,0.02)' } }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Box component="img" src={`/assets/${item.icon}`} alt={item.ticker} sx={{ width: 36, height: 36, objectFit: 'contain' }} />
                      <Box>
                        <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{item.ticker}</Typography>
                        <Typography sx={{ color: '#9CA3AF', fontSize: '12px' }}>{item.name}</Typography>
                      </Box>
                    </Box>
                    <Box sx={{ textAlign: 'center' }}>
                      <Typography sx={{ color: '#9CA3AF', fontSize: '12px' }}>{item.amount}</Typography>
                    </Box>
                    <Box sx={{ textAlign: 'right' }}>
                      <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '14px' }}>{item.value}</Typography>
                      <Chip label={item.change} size="small" sx={{ backgroundColor: 'rgba(0,230,118,0.1)', color: '#00E676', fontSize: '11px', height: 20 }} />
                    </Box>
                  </Box>
                  {idx < portfolioItems.length - 1 && <Divider sx={{ borderColor: '#1a2332' }} />}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Quick Actions */}
          <Box sx={{ mb: 5 }}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700, mb: 3 }}>Quick Actions</Typography>
            <Grid container spacing={2}>
              {[
                { label: 'Buy Crypto', color: '#00E676', textColor: '#000' },
                { label: 'Sell Crypto', color: 'transparent', textColor: '#00E676', border: '1px solid #00E676' },
                { label: 'Transfer', color: 'transparent', textColor: '#9CA3AF', border: '1px solid #1a2332' },
              ].map((action) => (
                <Grid size={{ xs: 12, sm: 4 }} key={action.label}>
                  <Button
                    fullWidth
                    size="large"
                    sx={{
                      backgroundColor: action.color, color: action.textColor,
                      border: action.border || 'none', borderRadius: '12px', py: 1.5, fontWeight: 600,
                      '&:hover': { opacity: 0.85 },
                    }}
                  >
                    {action.label}
                  </Button>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Market Overview mini */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 700 }}>Market Overview</Typography>
              <Button size="small" component={Link} href="/#market" sx={{ color: '#00E676', fontSize: '13px' }}>View All →</Button>
            </Box>
            <Grid container spacing={2}>
              {portfolioItems.map((coin, idx) => (
                <Grid size={{ xs: 6, sm: 3 }} key={idx}>
                  <CryptoCard icon={coin.icon} ticker={coin.ticker} name={coin.name} price={coin.price} change={coin.change} positive />
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#070B0E' }}>
        <CircularProgress sx={{ color: '#00E676' }} />
      </Box>
    }>
      <DashboardContent />
    </Suspense>
  );
}
