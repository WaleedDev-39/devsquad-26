'use client';
import { Box, Typography, useMediaQuery, useTheme } from '@mui/material';

const CATEGORIES = [
  { label: 'WORKOUT', image: '/assets/workout_img.png' },
  { label: 'RUN',     image: '/assets/run_img.png' },
  { label: 'FOOTBALL', image: '/assets/football_img.png' },
];

export default function BuyByCategory() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ mb: { xs: 2, md: 4 } }}>
      <Typography
        sx={{
          px: { xs: 2, md: 4 },
          pb: { xs: 2, md: 3 },
          fontWeight: 800,
          fontSize: { xs: 16, md: 20 },
          letterSpacing: '-0.01em',
          maxWidth: 1200,
          mx: 'auto',
          color: '#000'
        }}
      >
        Buy by category
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column' }}>
        {CATEGORIES.map((cat, index) => {
          // Even index (0, 2): Text Left, Image Right
          // Odd index (1): Image Left, Text Right
          const isImageRight = index % 2 === 0;

          return (
            <Box
              key={cat.label}
              sx={{
                display: 'grid',
                gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
                minHeight: { xs: 'auto', md: 400 },
                cursor: 'pointer',
                overflow: 'hidden',
                '&:hover img': { transform: 'scale(1.05)' },
              }}
            >
              {/* Text cell */}
              {!isMobile && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    bgcolor: '#fff',
                    order: isImageRight ? 1 : 2, // 1 goes left, 2 goes right
                  }}
                >
                  <Typography
                    sx={{
                      fontWeight: 900,
                      fontSize: { md: 32, lg: 40 },
                      letterSpacing: '0.25em',
                      fontStyle: 'italic',
                      color: '#000',
                      textTransform: 'uppercase',
                    }}
                  >
                    {cat.label}
                  </Typography>
                </Box>
              )}

              {/* Image cell */}
              <Box
                sx={{
                  position: 'relative',
                  overflow: 'hidden',
                  minHeight: { xs: 250, md: 400 },
                  order: isImageRight ? 2 : 1, // 2 goes right, 1 goes left
                }}
              >
                <Box
                  component="img"
                  src={cat.image}
                  alt={cat.label}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    display: 'block',
                    transition: 'transform 0.6s cubic-bezier(0.165, 0.84, 0.44, 1)',
                  }}
                />
                {/* Mobile label overlay */}
                {isMobile && (
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: 'rgba(0,0,0,0.25)',
                    }}
                  >
                    <Typography
                      sx={{
                        fontWeight: 900,
                        fontSize: 28,
                        letterSpacing: '0.25em',
                        fontStyle: 'italic',
                        color: '#fff',
                        textTransform: 'uppercase',
                        textShadow: '0 2px 12px rgba(0,0,0,0.5)',
                      }}
                    >
                      {cat.label}
                    </Typography>
                  </Box>
                )}
              </Box>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
