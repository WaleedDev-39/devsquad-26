'use client';
import { Box, Typography, Button, Container, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      sx={{
        minHeight: '100vh',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        overflow: 'hidden',
        pt: { xs: 10, md: 0 },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'radial-gradient(ellipse 70% 60% at 60% 40%, rgba(0,230,118,0.08) 0%, transparent 65%)',
          pointerEvents: 'none',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          height: '1px',
          background: 'linear-gradient(90deg, transparent, rgba(0,230,118,0.2), transparent)',
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexDirection: { xs: 'column-reverse', md: 'row' },
            gap: { xs: 4, md: 0 },
          }}
        >
          {/* Left: Text Content */}
          <Box
            sx={{
              maxWidth: { xs: '100%', md: '50%' },
              animation: 'fadeInUp 0.7s ease forwards',
            }}
          >
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '2.6rem', md: '3.5rem', lg: '4rem' },
                fontWeight: 800,
                lineHeight: 1.1,
                color: '#fff',
                mb: 2,
                letterSpacing: '-0.02em',
              }}
            >
              Save, Buy and Sell{' '}
              <br />
              Your blockchain
              <br />
              asset
            </Typography>
            <Typography
              sx={{
                color: '#fffff',
                fontSize: { xs: '15px', md: '20px' },
                lineHeight: 1.7,
                mb: 4,
                maxWidth: 380,
                letterSpacing: '0.05em',
              }}
            >
              The easy to manage and trade
              <br />
              your cryptocurrency asset
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                id="start-trading-btn"
                component={Link}
                href="/dashboard"
                sx={{
                  backgroundColor: '#00E676',
                  color: '#000',
                  fontSize: '14px',
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  borderRadius: '8px',
                  '&:hover': { backgroundColor: '#00c764' },
                }}
              >
                Connect Wallet
              </Button>
              <Button
                variant="contained"
                size="large"
                id="start-trading-btn"
                component={Link}
                href="/dashboard"
                sx={{
                  backgroundColor: '#ffff',
                  color: '#000',
                  fontSize: '14px',
                  fontWeight: 700,
                  px: 3,
                  py: 1.2,
                  borderRadius: '8px',
                  '&:hover': { backgroundColor: '#F2F0EF' },
                }}
              >
                Start Trading
              </Button>
            </Box>
          </Box>

          {/* Right: Hero Image */}
          <Box
            sx={{
              position: 'relative',
              width: { xs: '100%', md: '50%' },
              display: 'flex',
              justifyContent: 'flex-end',
              animation: 'fadeIn 1s ease 0.2s both',
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: { xs: '100%', md: '520px' },
                height: { xs: '280px', md: '460px' },
              }}
            >
              <Image
                src="/assets/hero_img.png"
                alt="Blockchain Asset Management"
                fill
                style={{ objectFit: 'contain' }}
                priority
              />
            </Box>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
