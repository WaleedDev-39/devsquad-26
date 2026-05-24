'use client';
import { Box, Typography } from '@mui/material';

export default function SummerMood() {
  return (
    <Box
      sx={{
        textAlign: 'center',
        py: { xs: 4, md: 6 },
        px: 2,
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: 12, md: 13 },
          color: '#888',
          letterSpacing: '0.08em',
          mb: 0.5,
        }}
      >
        At the moment
      </Typography>
      <Typography
        sx={{
          fontWeight: 900,
          fontSize: { xs: 32, md: 48 },
          fontStyle: 'italic',
          lineHeight: 1.05,
          letterSpacing: '-0.02em',
          color: '#000',
          textTransform: 'uppercase',
          mb: 1,
        }}
      >
        SUMMERTIME MOOD
      </Typography>
      <Typography
        sx={{
          fontSize: { xs: 13, md: 14 },
          color: '#555',
          letterSpacing: '0.02em',
        }}
      >
        Fight the heat in a sunny look!
      </Typography>
    </Box>
  );
}
