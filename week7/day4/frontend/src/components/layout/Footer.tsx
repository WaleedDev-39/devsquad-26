'use client';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';

const LEFT_LINKS = ['ALL', 'WOMAN', 'MEN'];
const RIGHT_LINKS = ['WORKOUT', 'RUN', 'FOOTBALL'];

export default function Footer() {
  return (
    <Box component="footer" sx={{ bgcolor: '#111', color: '#fff', pt: { xs: 5, md: 6 }, pb: { xs: 4, md: 5 } }}>
      <Box
        sx={{
          maxWidth: 1200,
          mx: 'auto',
          px: { xs: 3, md: 6 },
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: { xs: 5, md: 3 },
        }}
      >
        {/* Left links */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'column' }, gap: 1.5, alignItems: { xs: 'center', md: 'flex-start' } }}>
          {LEFT_LINKS.map((link) => (
            <Link key={link} href="/" style={{ textDecoration: 'none' }}>
              <Typography
                sx={{
                  color: '#ccc',
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  fontWeight: 400,
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.2s',
                }}
              >
                {link}
              </Typography>
            </Link>
          ))}
        </Box>

        {/* Center — logo */}
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1, order: { xs: -1, md: 0 } }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src="/assets/footer_nike_logo.png" 
            alt="Nike" 
            style={{ 
              height: 56, 
              width: 'auto',
              filter: 'brightness(0) invert(1)', 
              opacity: 0.9 
            }} 
          />
          <Typography
            sx={{
              color: '#555',
              fontSize: 8,
              letterSpacing: '0.3em',
              textAlign: 'center',
              mt: 0.5,
              textTransform: 'uppercase',
            }}
          >
            GLORY TO UKRAINE
          </Typography>
        </Box>

        {/* Right links */}
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'column' }, gap: 1.5, alignItems: { xs: 'center', md: 'flex-end' } }}>
          {RIGHT_LINKS.map((link) => (
            <Link key={link} href="/" style={{ textDecoration: 'none' }}> 
              <Typography
                sx={{
                  color: '#ccc',
                  fontSize: 12,
                  letterSpacing: '0.1em',
                  fontWeight: 400,
                  '&:hover': { color: '#fff' },
                  transition: 'color 0.2s',
                }}
              >
                {link}
              </Typography>
            </Link>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
