'use client';
import { Box, Typography } from '@mui/material';
import NorthEastIcon from '@mui/icons-material/NorthEast';
import Image from 'next/image';

interface CryptoCardProps {
  icon: string;
  ticker: string;
  name: string;
  price: string;
  change: string;
  positive?: boolean;
}

// Sparkline SVG wave
const Sparkline = ({ positive = true }: { positive?: boolean }) => (
  <svg width="80" height="35" viewBox="0 0 80 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M0 26 C10 24, 15 20, 20 18 C25 16, 28 22, 34 20 C40 18, 44 10, 50 12 C56 14, 60 22, 66 18 C72 14, 76 16, 80 12"
      stroke={positive ? '#00E676' : '#ef4444'}
      strokeWidth="2"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function CryptoCard({ icon, ticker, name, price, change, positive = true }: CryptoCardProps) {
  return (
    <Box
      className="crypto-card-hover"
      sx={{
        background: '#070B0E',
        border: '1.5px solid rgba(0, 230, 118, 0.65)',
        boxShadow: '0 0 15px rgba(0, 230, 118, 0.15)',
        borderRadius: '12px',
        p: { xs: 2 },
        px: { md: 2.5 },
        py: { md: 2.2 },
        display: 'grid',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.25s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 0 20px rgba(0, 230, 118, 0.25)',
          borderColor: 'rgba(0, 230, 118, 0.9)',
        },
      }}
    >
      {/* Top Row: Icon + Ticker + Arrow */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.2 }}>
          <Image src={`/assets/${icon}`} alt={ticker} width={28} height={28} style={{ objectFit: 'contain' }} />
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Typography sx={{ color: '#fff', fontWeight: 600, fontSize: '14px', lineHeight: 1.1 }}>
              {ticker}
            </Typography>
            <Box
              sx={{
                background: name === '—' ? '#fff' : (ticker === 'BTC' ? 'transparent' : '#2A3036'),
                height: name === '—' ? '12px' : 'auto',
                py: name === '—' ? 0 : 0.3,
                px: name === '—' ? 2 : 0.6,
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {name !== '—' && (
                <Typography sx={{ color: '#9CA3AF', fontSize: '8.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  {name}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
        <NorthEastIcon sx={{ color: '#fff', fontSize: '18px' }} />
      </Box>

      {/* Body: Price + Change + Sparkline */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mt: 3.5, mb: 0.5 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7 }}>
          <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: { xs: '17px', md: '19px' }, lineHeight: 1 }}>
            {price}
          </Typography>
          <Typography sx={{ color: '#fff', fontSize: '11px', fontWeight: 500 }}>
            {change}
          </Typography>
        </Box>
        <Box sx={{ mb: -0.5, mr: -1 }}>
          <Sparkline positive={positive} />
        </Box>
      </Box>
    </Box>
  );
}
