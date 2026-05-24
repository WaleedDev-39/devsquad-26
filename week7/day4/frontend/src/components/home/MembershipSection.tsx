'use client';
import { Box, Typography, Button } from '@mui/material';

export default function MembershipSection() {
  return (
    <Box sx={{ pb: { xs: 4, md: 6 }, width: '100%', maxWidth: { xs: '100%', md: 1200 }, mx: 'auto', px: { xs: 0, md: 4 } }}>
      <Typography
        sx={{
          fontWeight: 700,
          fontSize: { xs: 14, md: 16 },
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          mb: 2,
          px: { xs: 2, md: 0 },
        }}
      >
        MORE NIKE PRODUCTS
      </Typography>

      <Box
        sx={{
          position: 'relative',
          borderRadius: { xs: 0, md: 3 },
          overflow: 'hidden',
          minHeight: { xs: 200, md: 260 },
          bgcolor: '#111',
          display: 'flex',
          alignItems: 'flex-end',
        }}
      >
        {/* Background image */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/assets/membership_img.png"
          alt="Nike Membership"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            objectPosition: 'center',
            opacity: 0.55,
          }}
        />

        {/* Content */}
        <Box
          sx={{
            position: 'relative',
            p: { xs: 3, md: 4 },
            zIndex: 1,
            maxWidth: 360,
          }}
        >
          <Typography
            sx={{
              color: '#fff',
              fontWeight: 900,
              fontSize: { xs: 18, md: 24 },
              fontStyle: 'italic',
              textTransform: 'uppercase',
              lineHeight: 1.1,
              mb: 0.8,
            }}
          >
            YOUR NIKE MEMBERSHIP
          </Typography>
          <Typography
            sx={{
              color: '#ccc',
              fontSize: { xs: 11, md: 12 },
              mb: 2,
              lineHeight: 1.5,
            }}
          >
            Join our members and show your love for Nike By You!
          </Typography>
          <Button
            variant="outlined"
            sx={{
              borderColor: '#fff',
              color: '#fff',
              fontSize: 11,
              fontWeight: 700,
              px: 2.5,
              py: 0.6,
              borderRadius: 1,
              textTransform: 'none',
              '&:hover': { bgcolor: '#fff', color: '#000' },
              transition: 'all 0.2s',
            }}
          >
            Join Us
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
