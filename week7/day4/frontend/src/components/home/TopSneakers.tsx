'use client';
import { useRef, useState } from 'react';
import { Box, Typography, IconButton, Skeleton, CircularProgress } from '@mui/material';
import { ArrowBackIcon, ArrowForwardIcon, ShoppingCartIcon } from '@/components/shared/Icons';
import { useGetProductsQuery } from '@/services/productsApi';
import { useAddToCartMutation } from '@/services/cartApi';

export default function TopSneakers() {
  const { data: products, isLoading } = useGetProductsQuery();
  const [addToCart] = useAddToCartMutation();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [adding, setAdding] = useState<string | null>(null);

  const topProducts = products?.filter((p) => !p.badge?.includes('%')).slice(0, 6) || [];

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    // Scroll by the width of one card + gap
    const scrollAmount = scrollRef.current.clientWidth / 3;
    scrollRef.current.scrollBy({ left: dir === 'right' ? scrollAmount : -scrollAmount, behavior: 'smooth' });
  };

  const handleAdd = async (product: typeof topProducts[0]) => {
    setAdding(product.id);
    await addToCart({ productId: product.id, name: product.name, price: product.price, image: product.image });
    setAdding(null);
  };

  return (
    <Box sx={{ px: { xs: 2, md: 4 }, pb: { xs: 4, md: 6 },  maxWidth: 1200, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography sx={{ fontWeight: 800, fontSize: { xs: 20, md: 24 }, letterSpacing: '-0.01em', color: '#000' }}>
          Top sneakers
        </Typography>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <IconButton
            onClick={() => scroll('left')}
            sx={{
              width: 36, height: 36, bgcolor: '#f4f4f4', color: '#000',
              '&:hover': { bgcolor: '#e0e0e0' }, transition: 'all 0.2s',
            }}
          >
            <ArrowBackIcon sx={{ fontSize: 16 }} />
          </IconButton>
          <IconButton
            onClick={() => scroll('right')}
            sx={{
              width: 36, height: 36, bgcolor: '#f4f4f4', color: '#000',
              '&:hover': { bgcolor: '#e0e0e0' }, transition: 'all 0.2s',
            }}
          >
            <ArrowForwardIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>

      {/* Cards scroll row */}
      <Box
        ref={scrollRef}
        sx={{
          display: 'flex',
          gap: { xs: 2, md: 3 },
          overflowX: 'auto',
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': { display: 'none' },
          pb: 1,
          scrollSnapType: 'x mandatory',
        }}
      >
        {isLoading
          ? Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" sx={{ minWidth: 'calc((100% - 48px) / 3)', height: 320, borderRadius: 4, flexShrink: 0 }} />
          ))
          : topProducts.map((product) => (
            <Box
              key={product.id}
              sx={{
                // Exactly 3 cards visible on desktop, 2 on tablet, 1 on mobile
                flex: { xs: '0 0 100%', sm: '0 0 calc((100% - 16px) / 2)', md: '0 0 calc((100% - 48px) / 3)' },
                scrollSnapAlign: 'start',
                bgcolor: '#EFEFEF',
                borderRadius: 4,
                p: { xs: 3, md: 4 },
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden',
                height: { xs: 300, md: 460 },
                transition: 'box-shadow 0.3s',
                '&:hover': { boxShadow: '0 12px 32px rgba(0,0,0,0.08)' },
                '&:hover .shoe-img': {
                  transform: 'rotate(-5deg) scale(1.05)',
                }
              }}
            >
              {/* Background NIKE watermark image */}
              <Box
                component="img"
                src="/assets/NIKE.png"
                alt="NIKE"
                sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  height: '80%',
                  opacity: 1, // Make it look like a watermark
                  pointerEvents: 'none',
                  userSelect: 'none',
                  zIndex: 0,
                }}
              />

              {/* Shoe image */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  position: 'absolute',
                  top: '40%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: '100%',
                  height: '100%',
                  zIndex: 1,
                }}
              >
                <Box
                  component="img"
                  src={product.image}
                  alt={product.name}
                  className="shoe-img"
                  sx={{
                    width: '110%',
                    objectFit: 'contain',
                    filter: 'drop-shadow(4px 12px 16px rgba(0,0,0,0.2))',
                    transform: 'rotate(-15deg) scale(1)', // Base angle
                    transition: 'transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)', // Smooth bounce animation
                  }}
                />
              </Box>

              {/* Text at bottom left */}
              <Box sx={{ zIndex: 1, position: 'absolute', bottom: { xs: 20, md: 24 }, left: { xs: 20, md: 24 }, width: 'calc(100% - 80px)' }}>
                <Typography sx={{ fontWeight: 900, fontSize: { xs: 18, md: 22 }, color: '#000', mb: 0.5, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {product.name}
                </Typography>
                <Typography sx={{ fontSize: 12, color: '#333', fontWeight: 500 }}>
                  ${product.price.toFixed(2)}
                </Typography>
              </Box>

              {/* Circular Add to Cart Button */}
              <IconButton
                onClick={() => handleAdd(product)}
                disabled={adding === product.id}
                sx={{
                  position: 'absolute',
                  bottom: { xs: 20, md: 24 },
                  right: { xs: 20, md: 24 },
                  bgcolor: '#fff',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  width: 40,
                  height: 40,
                  zIndex: 2,
                  '&:hover': { bgcolor: '#000', color: '#fff' },
                  transition: 'all 0.2s',
                }}
              >
                {adding === product.id
                  ? <CircularProgress size={18} color="inherit" />
                  : <ShoppingCartIcon sx={{ fontSize: 18 }} />
                }
              </IconButton>
            </Box>
          ))}
      </Box>
    </Box>
  );
}
