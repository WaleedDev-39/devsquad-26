'use client';
import {
  AppBar, Toolbar, Box, Typography, Button, IconButton,
  Drawer, List, ListItem, ListItemButton, ListItemText,
  Avatar, Tooltip, useMediaQuery, useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import TelegramIcon from '@mui/icons-material/Telegram';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/services/store';
import { restoreSession, logout } from '@/services/authSlice';
import { useRouter } from 'next/navigation';

const navLinks = [
  { label: 'How it work', href: '#features' },
  { label: 'Blog', href: '#blog' },
  { label: 'Support', href: '#support' },
];

const SocialIcon = ({ icon, href }: { icon: any; href: string }) => (
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

export default function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const dispatch = useDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useSelector((s: RootState) => s.auth);

  useEffect(() => {
    dispatch(restoreSession());
  }, [dispatch]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          backgroundColor: scrolled ? 'rgba(7,11,14,0.95)' : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          borderBottom: scrolled ? '1px solid #1a2332' : 'none',
          transition: 'all 0.3s ease',
          zIndex: 1200,
        }}
      >
        <Toolbar sx={{ maxWidth: 1200, mx: 'auto', width: '100%', px: { xs: 2, md: 4 }, py: 1 }}>
          {/* Logo */}
          <Box component={Link} href="/" sx={{ display: 'flex', alignItems: 'center', gap: 1, textDecoration: 'none', mr: 4 }}>
            <Image src="/assets/Logo.png" alt="Circlechain Logo" width={180} height={180} style={{ objectFit: 'contain' }} />
          </Box>

          {!isMobile && (
            <>
              {/* Nav Links */}
              <Box sx={{ display: 'flex', gap: 3, flex: 1 }}>
                {navLinks.map((link) => (
                  <Typography
                    key={link.label}
                    component="a"
                    href={link.href}
                    sx={{
                      color: '#fffff', fontSize: '18px', fontWeight: 400,
                      textDecoration: 'none', cursor: 'pointer',
                      transition: 'color 0.2s',
                      '&:hover': { textDecoration: 'underline', textDecorationColor: '#00E676', textDecorationThickness: '2px', textUnderlineOffset: '10px' },
                    }}
                  >
                    {link.label}
                  </Typography>
                ))}
              </Box>

              {/* Social Icons */}
              <Box sx={{ display: 'flex', gap: 1, mr: 2 }}>
                <SocialIcon icon={<FacebookIcon fontSize="small" />} href="https://facebook.com" />
                <SocialIcon icon={<InstagramIcon fontSize="small" />} href="https://instagram.com" />
                <SocialIcon icon={<LinkedInIcon fontSize="small" />} href="https://linkedin.com" />
                <SocialIcon icon={<TwitterIcon fontSize="small" />} href="https://twitter.com" />
                <SocialIcon icon={<TelegramIcon fontSize="small" />} href="https://telegram.org" />
              </Box>

              {/* Auth */}
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <Tooltip title="Profile">
                    <Avatar
                      src={user?.avatar}
                      alt={user?.name}
                      sx={{ width: 36, height: 36, cursor: 'pointer', border: '2px solid #00E676' }}
                      onClick={() => router.push('/profile')}
                    />
                  </Tooltip>
                  <Button
                    variant="outlined"
                    size="small"
                    onClick={handleLogout}
                    sx={{ borderColor: '#1a2332', color: '#9CA3AF', fontSize: '12px', '&:hover': { borderColor: '#ef4444', color: '#ef4444' } }}
                  >
                    Logout
                  </Button>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button variant="outlined" size="small" component={Link} href="/login">Login</Button>
                  <Button variant="contained" size="small" component={Link} href="/signup">Sign Up</Button>
                </Box>
              )}
            </>
          )}

          {isMobile && (
            <Box sx={{ ml: 'auto' }}>
              <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#fff' }}>
                <MenuIcon />
              </IconButton>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { backgroundColor: '#0D1117', width: 280, borderLeft: '1px solid #1a2332' } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #1a2332' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Image src="/assets/Logo.png" alt="Logo" width={180} height={180} style={{ objectFit: 'contain' }} />
            
          </Box>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ color: '#9CA3AF' }}>
            <CloseIcon />
          </IconButton>
        </Box>
        <List>
          {navLinks.map((link) => (
            <ListItem key={link.label} disablePadding>
              <ListItemButton component="a" href={link.href} onClick={() => setDrawerOpen(false)}>
                
              </ListItemButton>
            </ListItem>
          ))}
          <ListItem sx={{ pt: 2 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, width: '100%' }}>
              {isAuthenticated ? (
                <>
                  <Button fullWidth variant="outlined" component={Link} href="/profile" onClick={() => setDrawerOpen(false)}>Profile</Button>
                  <Button fullWidth variant="outlined" onClick={handleLogout} sx={{ borderColor: '#ef4444', color: '#ef4444' }}>Logout</Button>
                </>
              ) : (
                <>
                  <Button fullWidth variant="outlined" component={Link} href="/login" onClick={() => setDrawerOpen(false)}>Login</Button>
                  <Button fullWidth variant="contained" component={Link} href="/signup" onClick={() => setDrawerOpen(false)}>Sign Up</Button>
                </>
              )}
            </Box>
          </ListItem>
        </List>
      </Drawer>
    </>
  );
}
