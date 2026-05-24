'use client';
import { Box, Typography, Button, useMediaQuery, useTheme } from '@mui/material';

export default function HeroBanner() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box>
      {/* ── Announcement Bar ── */}
      <Box
        sx={{
          position: 'relative',
          overflow: 'hidden',
          minHeight: { xs: 'auto', md: 220 },
        }}
      >
        {/* Background mosaic grid + QR code – right side (desktop only) */}
        {!isMobile && (
          <Box
            component="img"
            src="/assets/desktop_hero_img.png"
            alt="Nike collection banner"
            sx={{
              position: 'relative',
              top: 0,
              right: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: 'right',
            }}
          />
        )}

        {/* Mobile upper hero */}
        {isMobile && (
          <Box
            component="img"
            src="/assets/mobile_upper_hero_img.png"
            alt="Nike collection mobile"
            sx={{ width: '100%', display: 'block', objectFit: 'cover' }}
          />
        )}

        {/* Text overlay */}
        <Box
          sx={{
            position: { xs: 'static', md: 'absolute' },
            top: 0,
            left: 0,
            width: { xs: '100%', md: '50%' },
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            px: { xs: 3, md: 5 },
            py: { xs: 3, md: 0 },
            bgcolor: { xs: '#1a1a1a', md: 'transparent' },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: '#fff',
              fontWeight: 900,
              fontStyle: 'italic',
              fontSize: { xs: 18, md: 40 },
              letterSpacing: '-0.01em',
              mb: 1,
              textTransform: 'uppercase',
            }}
          >
            WE ARE NEVER DONE
          </Typography>
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 700,
              fontSize: { xs: 11, md: 22 },
              lineHeight: 1,
              my: 2.5,
              maxWidth: 550,
            }}
          >
            Celebrating 50 years of Nike from May 16th!
            <br />
            Exclusive products, experiences and much more
            <br />
            await you for five days. Scan and join the Nike app!
          </Typography>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#fff',
              color: '#000', 
              fontSize: 11, 
              fontWeight: 700,
              px: 2.5,
              py: 0.8,
              mt: 3,
              borderRadius: 1.5,
              alignSelf: 'flex-start',
              '&:hover': { bgcolor: '#f0f0f0' },
              textTransform: 'none',
            }}
          >
            Celebrate with us
          </Button>
        </Box>
      </Box>

      {/* ── JUST DO IT Marquee ── */}
      <Box
        sx={{
          bgcolor: '#fff',
          py: 0.5,
          overflow: 'hidden',
          display: 'flex',
        }}
      >
        <Box
          className="marquee-track"
          sx={{
            display: 'flex',
            whiteSpace: 'nowrap',
            width: 'max-content',
          }}
        >
          {Array.from({ length: 15 }).map((_, i) => (
            <img key={i} src="/assets/just_do_it.png" alt="" />
          ))}
        </Box>
      </Box>

      {/* ── Large Nike Hero ── */}
      <Box sx={{ position: 'relative', overflow: 'hidden', bgcolor: '#e8e8e8' }}>
        <Box
          component="img"
          src="/assets/main_img.png"
          alt="Nike Hero"
          sx={{
            width: '100%',
            display: 'block',
            objectFit: 'cover',
            maxHeight: { xs: 300, md: 600 },
            objectPosition: 'center',
          }}
        />
      </Box>
    </Box>
  );
}
