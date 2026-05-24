'use client';
import { Box, Typography, Container, useMediaQuery, useTheme } from '@mui/material';
import Image from 'next/image';

const features = [
  {
    title: 'Access Token Market',
    description: 'Buy and sell token anytime and anywhere',
  },
  {
    title: 'User Friendly Interface',
    description: 'Easy to navigate',
  },
  {
    title: 'Ownership Token control',
    description: 'Be in control and own as many asset as possible',
  },
];

export default function FeaturesSection() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box
      id="features"
      sx={{
        py: { xs: 8, md: 10 },
        position: 'relative',
        backgroundColor: '#070B0E',
      }}
    >
      <Container maxWidth="lg">
        {/* Heading */}
        <Box sx={{ textAlign: 'center', mb: { xs: 6, md: 8 } }}>
          <Typography
            variant="h2"
            sx={{
              fontSize: { xs: '1.6rem', md: '2.2rem' },
              fontWeight: 700,
              color: '#fff',
              maxWidth: 680,
              mx: 'auto',
              lineHeight: 1.3,
              mb: 0.5,
            }}
          >
            Global Decentralize currency based on
            <br />
            blockchain technology
          </Typography>
          <Typography sx={{ color: '#00E676', fontSize: '13px', fontWeight: 500 }}>
            Web3 is the latest efficient technology
          </Typography>
        </Box>

        {/* Content Row */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: 4, md: 6 },
            flexDirection: { xs: 'column', md: 'row' },
          }}
        >
          {/* Left: Market Image */}
          <Box
            sx={{
              flex: 1,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              position: 'relative',
              minHeight: { xs: 260, md: 360 },
            }}
          >
            {/* Glow effect */}
            <Box
              sx={{
                position: 'absolute',
                width: '80%', height: '80%',
                background: 'radial-gradient(ellipse, rgba(0,230,118,0.15) 0%, transparent 70%)',
              }}
            />
            <Image
              src="/assets/market_img.png"
              alt="Market Features"
              width={460}
              height={360}
              style={{ objectFit: 'contain', position: 'relative', zIndex: 1 }}
            />
          </Box>

          {/* Right: Feature Cards */}
          <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: { xs: 2.5, md: 3.5 } }}>
            {features.map((feature, idx) => (
              <Box
                key={idx}
                sx={{
                  background: 'linear-gradient(90deg, rgba(7, 11, 14, 0) 0%, rgba(100, 232, 149, 0.15) 30%, #65E895 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  minHeight: { xs: '95px', md: '110px' },
                  p: { xs: 2.5, md: 3 },
                  pr: { xs: 3.5, md: 5 },
                  textAlign: 'right',
                  cursor: 'default',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'transform 0.25s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', zIndex: 1 }}>
                  <Typography
                    sx={{
                      color: '#fff',
                      fontWeight: 800,
                      fontSize: { xs: '18px', md: '22px' },
                      mb: { xs: 0.25, md: 0.5 },
                      letterSpacing: '-0.3px',
                    }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography 
                    sx={{ 
                      color: '#13281E', 
                      fontWeight: 500, 
                      fontSize: { xs: '13px', md: '15px' }, 
                      lineHeight: 1.4,
                      maxWidth: '260px',
                    }}
                  >
                    {feature.description}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
