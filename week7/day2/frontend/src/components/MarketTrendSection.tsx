'use client';
import { Box, Typography, Container, Grid } from '@mui/material';
import CryptoCard from './CryptoCard';

const cryptoData = [
  { icon: 'bitcoin_img.png', ticker: 'BTC', name: 'Bitcoin', price: '$56,623.54', change: '1.41%' },
  { icon: 'etherium_img.png', ticker: 'ETH', name: '—', price: '$4,267.90', change: '2.22%' },
  { icon: 'bnb_img.png', ticker: 'BNB', name: 'Binance', price: '$587.74', change: '0.82%' },
  { icon: 'usdt_img.png', ticker: 'USDT', name: 'Tether', price: '$0.9998', change: '0.03%' },
];

// 4 rows × 4 cols = 16 cards (matching design)
const allCards = [...cryptoData, ...cryptoData, ...cryptoData, ...cryptoData];

export default function MarketTrendSection() {
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        backgroundColor: '#070B0E',
        position: 'relative',
      }}
    >
      <Container maxWidth="lg">
        <Typography
          variant="h2"
          sx={{
            color: '#fff',
            fontWeight: 700,
            fontSize: { xs: '1.6rem', md: '2rem' },
            mb: 4,
          }}
        >
          Market Trend
        </Typography>

        <Grid container spacing={3} alignitems="stretch" sx={{
          display: 'grid', gridTemplateColumns: {
            xs: 'repeat(1, 1fr)',
            sm: 'repeat(1, 1fr)',
            md: 'repeat(2, 1fr)',
            lg: 'repeat(4, 1fr)',
            xl: 'repeat(4, 1fr)'
          }, gap: 2
        }}>
          {allCards.map((coin, idx) => (
            <Grid item xs={12} sm={6} md={3} lg={3} key={idx} sx={{ display: 'flex' }}>
              <Box sx={{ width: '100%', height: '100%' }}>
                <CryptoCard
                  icon={coin.icon}
                  ticker={coin.ticker}
                  name={coin.name}
                  price={coin.price}
                  change={coin.change}
                  positive
                />
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
