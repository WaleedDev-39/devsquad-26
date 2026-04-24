'use client';
import { Box, Typography, Container, Grid } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';

const quickLinks = [
  { label: 'How it work', href: '#features' },
  { label: 'Blog', href: '#blog' },
  { label: 'Support', href: '#support' },
];

const SocialBtn = ({ icon, href }: { icon: any; href: string }) => (
  <Box
    component="a"
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    sx={{
      width: 34, height: 34,
      border: '2px solid #ffffff',
      borderRadius: '6px',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#ffffff', fontSize: '24px', fontWeight: 700,
      textDecoration: 'none',
      transition: 'all 0.2s',
      '&:hover': { borderColor: '#00E676', color: '#00E676' },
    }}
  >
    {icon}
  </Box>
);

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#070B0E',
        borderTop: '1px solid #1a2332',
        pt: { xs: 5, md: 6 },
        pb: 3,
      }}
    >
      <Container maxWidth="lg">
        <div className='grid grid-cols-1 md:grid-cols-3 justify-items-center gap-10 mb-10'>
          {/* Brand */}
          <div className='flex flex-col items-center md:items-start text-center md:text-left'>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
              <Image src="/assets/Logo.png" alt="Circlechain" width={180} height={180} style={{ objectFit: 'contain' }} />
            </Box>
            <Typography
              sx={{
                color: '#ffffff',
                fontSize: '13px',
                lineHeight: 1.8,
                maxWidth: 300,
              }}
            >
              Amet minim mollit non deserunt ullamco est aliqua dolor do amet sint. Velit officia consequatduis enim velit mollit. Exercitation veniamconsequat sunt nostrud amet.
            </Typography>
          </div>

          {/* Quick Links */}
          <div className='flex flex-col items-center'>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '18px', mb: 3 }}>
              Quick Link
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, alignItems: 'center' }}>
              {quickLinks.map((link) => (
                <Typography
                  key={link.label}
                  component="a"
                  href={link.href}
                  sx={{
                    color: '#ffffff', fontSize: '13px', textDecoration: 'none',
                    transition: 'color 0.2s',
                    '&:hover': { color: '#00E676' },
                  }}
                >
                  {link.label}
                </Typography>
              ))}
            </Box>
          </div>

          {/* Social Media */}
          <div className='flex flex-col items-center md:items-end'>
            <Typography sx={{ color: '#fff', fontWeight: 700, fontSize: '18px', mb: 3 }}>
              Social Media
            </Typography>
            <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', justifyContent: 'center' }}>
              <SocialBtn icon={<FacebookIcon fontSize="small" />} href="https://facebook.com" />
              <SocialBtn icon={<InstagramIcon fontSize="small" />} href="https://instagram.com" />
              <SocialBtn icon={<LinkedInIcon fontSize="small" />} href="https://linkedin.com" />
              <SocialBtn icon={<TwitterIcon fontSize="small" />} href="https://twitter.com" />
              <SocialBtn icon={<TelegramIcon fontSize="small" />} href="https://telegram.org" />
            </Box>
          </div>
        </div>

        {/* Copyright */}
        <Box sx={{ pt: 2.5, textAlign: { xs: 'center', md: 'right' } }}>
          <Typography sx={{ color: '#ffffff', fontSize: '12px' }}>
            (c) 2022 Circlechain
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
