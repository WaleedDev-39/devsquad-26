'use client';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { useState } from 'react';
import { useAddToCartMutation } from '@/services/cartApi';

const DISCOUNT_PRODUCTS = [
  { id: '6', name: 'Nike Air Max Classic', price: 16.79, image: '/assets/shoe_6.png' },
  { id: '7', name: 'Nike Presto Premium', price: 16.79, image: '/assets/shoe_7.png' },
];

export default function DiscountSection() {
  const [addToCart] = useAddToCartMutation();
  const [adding, setAdding] = useState<string | null>(null);

  const handleAdd = async (p: typeof DISCOUNT_PRODUCTS[0]) => {
    setAdding(p.id);
    await addToCart({ productId: p.id, name: p.name, price: p.price, image: p.image });
    setAdding(null);
  };

  return (
    <Box sx={{ bgcolor: '#fff', py: { xs: 4, md: 6 }, px: { xs: 2, md: 4 } }}>
      {/* Heading */}
      <Typography
        sx={{
          textAlign: 'center',
          fontWeight: 900,
          fontStyle: 'italic',
          fontSize: { xs: 24, md: 32 },
          letterSpacing: '-0.02em',
          textTransform: 'uppercase',
          mb: { xs: 4, md: 6 },
          maxWidth: 1200,
          mx: 'auto',
          color: '#000'
        }}
      >
        LOOKS GOOD. RUNS GOOD. FEELS GOOD.
      </Typography>

      {/* Two promo cards */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
          gap: { xs: 4, md: 6 },
          maxWidth: 1000,
          mx: 'auto',
        }}
      >
        {DISCOUNT_PRODUCTS.map((product) => (
          <Box
            key={product.id}
            sx={{
              bgcolor: '#f4f4f4',
              borderRadius: 4,
              p: { xs: 3, md: 4 },
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
              overflow: 'visible', // allow image to overflow
              minHeight: { xs: 140, md: 180 },
              boxShadow: { xs: '0 4px 16px rgba(0,0,0,0.1)', md: '0 8px 32px rgba(0,0,0,0.06)' },
              transition: 'transform 0.2s',
              '&:hover': { 
                transform: 'translateY(-4px)', 
                boxShadow: { xs: '0 4px 16px rgba(0,0,0,0.15)', md: '0 12px 40px rgba(0,0,0,0.1)' } 
              },
            }}
          >
            {/* Left Content */}
            <Box sx={{ position: 'relative', zIndex: 2, maxWidth: { xs: '65%', md: '100%' } }}>
              <Typography sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 0.5, md: 1 } }}>
                <Box component="span" sx={{ color: '#ff3333', fontWeight: 900, fontSize: { xs: 16, md: 22 } }}>
                  -20%
                </Box>
                <Box component="span" sx={{ color: '#ff3333', fontWeight: 800, fontSize: { xs: 13, md: 16 } }}>
                  Discount
                </Box>
              </Typography>
              <Typography sx={{ fontSize: { xs: 10, md: 12 }, color: '#555', mb: { xs: 2, md: 3 } }}>
                on your first purchase
              </Typography>
              <Button
                variant="contained"
                onClick={() => handleAdd(product)}
                disabled={adding === product.id}
                sx={{
                  bgcolor: '#000',
                  color: '#fff',
                  fontSize: { xs: 10, md: 12 },
                  fontWeight: 600,
                  px: { xs: 2, md: 3 },
                  py: { xs: 0.8, md: 1 },
                  borderRadius: 2,
                  textTransform: 'none',
                  minWidth: { xs: 80, md: 100 },
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  '&:hover': { bgcolor: '#222' },
                }}
              >
                {adding === product.id ? <CircularProgress size={16} color="inherit" /> : 'Shop now'}
              </Button>
            </Box>

            {/* Right floating image */}
            <Box
              sx={{
                position: 'absolute',
                right: { xs: -10, md: -30 },
                top: '50%',
                transform: { xs: 'translateY(-50%) translateX(5%)', md: 'translateY(-50%)' },
                zIndex: 3,
                pointerEvents: 'none', // prevent image from blocking clicks
              }}
            >
              <Box
                component="img"
                src={product.image}
                alt={product.name}
                sx={{
                  width: { xs: 160, md: 280 },
                  objectFit: 'contain',
                  filter: 'drop-shadow(-4px 12px 16px rgba(0,0,0,0.25))',
                  transform: 'rotate(-5deg)',
                }}
              />
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
