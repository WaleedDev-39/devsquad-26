'use client';
import { Box, Typography } from '@mui/material';

export default function GlorySection() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 5, md: 7 },
        px: 2,
        bgcolor: '#fff',
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 11, md: 12 },
          color: '#000000',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          mb: 1,
        }}
      >
        Thanks for watching
      </Typography>
      <Typography
        sx={{
          fontWeight: 900,
          fontStyle: 'italic',
          fontSize: { xs: 28, md: 40 },
          letterSpacing: '-0.01em',
          color: '#000',
          mb: 1.5,
        }}
      >
        Glory to Ukraine
      </Typography>
      {/* Ukrainian flag emoji */}
      <Box component="img" src="/assets/ukraine_flag.png" alt="flag" />
    </Box>
  );
}
