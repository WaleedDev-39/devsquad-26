'use client';
import { Box, Typography, IconButton } from '@mui/material';
import { NorthEastIcon } from '@/components/shared/Icons';
import { useAddToCartMutation } from '@/services/cartApi';

const NEW_PRODUCTS = [
  { 
    id: '1', 
    name: 'AIR JORDAN 1 MID\nLIGHT SMOKE GREY', 
    image: '/assets/shoe_1.png', 
    price: 20.99,
    imgProps: { height: { xs: 160, md: 280 }, right: { xs: -10, md: -60 }, top: '45%' }
  },
  { 
    id: '2', 
    name: 'Air Max 200 SE', 
    image: '/assets/shoe_2.png', 
    price: 20.99,
    imgProps: { height: { xs: 150, md: 280 }, right: { xs: -10, md: -50 }, top: '50%' }
  },
];

export default function NewArrivals() {
  const [addToCart] = useAddToCartMutation();

  const handleAdd = async (product: typeof NEW_PRODUCTS[0]) => {
    await addToCart({ 
      productId: product.id, 
      name: product.name.replace('\n', ' '), 
      price: product.price, 
      image: product.image 
    });
  };

  return (
    <Box 
      sx={{ 
        px: { xs: 2, md: 4 }, 
        display: 'grid', 
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
        gap: { xs: 4, md: 6 }, 
        maxWidth: 1000, 
        mx: 'auto',
        mt: { xs: -4, md: -8 }, // Negative margin to overlap the hero banner above
        position: 'relative',
        zIndex: 10,
        mb: { xs: 4, md: 6 }
      }}
    >
      {NEW_PRODUCTS.map((product) => (
        <Box
          key={product.id}
          sx={{
            bgcolor: '#f4f4f4', 
            borderRadius: 3, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            position: 'relative', 
            height: { xs: 150, md: 170 },
            boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            '&:hover': { 
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.18)' 
            },
          }}
        >
          {/* Left Text & Button Area */}
          <Box 
            sx={{ 
              p: { xs: 2, md: 3.5 },
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              justifyContent: 'space-between',
              position: 'relative',
              zIndex: 2,
            }}
          >
            <Box>
              <Typography 
                sx={{ 
                  color: '#ff3333', 
                  fontWeight: 900, 
                  fontStyle: 'italic',
                  fontSize: { xs: 20, md: 24 }, 
                  letterSpacing: '0.04em', 
                  mb: 1 
                }}
              >
                NEW
              </Typography>
              <Typography 
                sx={{ 
                  fontWeight: 600, 
                  fontSize: { xs: 10, md: 11 }, 
                  color: '#555', 
                  lineHeight: 1.4, 
                  whiteSpace: 'pre-line', 
                  maxWidth: 150,
                  textTransform: 'uppercase',
                  letterSpacing: '0.02em'
                }}
              >
                {product.name}
              </Typography>
            </Box>
            
            <IconButton
              onClick={() => handleAdd(product)}
              sx={{
                bgcolor: '#fff', 
                color: "#000000",
                boxShadow: '0 2px 10px rgba(0,0,0,0.1)', 
                width: 36, 
                height: 36,
                alignSelf: 'flex-start',
                '&:hover': { bgcolor: '#000', color: '#fff' }, 
                transition: 'all 0.2s',
              }}
            >
              <NorthEastIcon sx={{ fontSize: 16 }} />
            </IconButton>
          </Box>

          {/* Right Image Floating Area */}
          <Box 
            component="img"
            src={product.image} 
            alt={product.name} 
            sx={{
              position: 'absolute', 
              right: product.imgProps.right, 
              top: product.imgProps.top,
              transform: 'translateY(-50%)',
              zIndex: 3,
              pointerEvents: 'none',
              height: product.imgProps.height,
              objectFit: 'contain', 
              filter: 'drop-shadow(-4px 12px 16px rgba(0,0,0,0.25))' 
            }}
          />
        </Box>
      ))}
    </Box>
  );
}
