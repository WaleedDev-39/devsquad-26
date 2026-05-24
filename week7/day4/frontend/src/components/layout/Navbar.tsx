'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  AppBar, Toolbar, Box, IconButton, Drawer, List, ListItem,
  Typography, Divider, Badge, useMediaQuery, useTheme,
} from '@mui/material';
import {
  SearchIcon, PersonOutlineIcon, ShoppingBagOutlinedIcon,
  MenuIcon, CloseIcon,
} from '@/components/shared/Icons';
import { useGetCartQuery } from '@/services/cartApi';

const NAV_ITEMS = ['WOMAN', 'MEN', 'ALL'];
const DRAWER_NAV = ['ALL', 'WOMAN', 'MEN', 'WORKOUT', 'RUN', 'FOOTBALL'];

export default function Navbar() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('ALL');
  const { data: cart } = useGetCartQuery();

  const totalItems = cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;

  return (
    <>
      <AppBar
        position="sticky"
        elevation={0}
        sx={{ bgcolor: '#fff', color: '#000', borderBottom: '1px solid #e8e8e8', zIndex: 1200 }}
      >
        <Toolbar sx={{ minHeight: { xs: 56, md: 64 }, px: { xs: 2, md: 4 }, justifyContent: 'space-between' }}>
          {/* LEFT */}
          {isMobile ? (
            <IconButton onClick={() => setDrawerOpen(true)} sx={{ color: '#000', p: 0.5 }}>
              <MenuIcon sx={{ fontSize: 26 }} />
            </IconButton>
          ) : (
            <Box sx={{ display: 'flex', gap: 4 }}>
              {NAV_ITEMS.map((item) => (
                <Box
                  key={item}
                  onClick={() => setActiveTab(item)}
                  sx={{
                    cursor: 'pointer', fontSize: 13,
                    fontWeight: activeTab === item ? 700 : 400,
                    letterSpacing: '0.08em', color: '#000',
                    borderBottom: activeTab === item ? '2px solid #000' : '2px solid transparent',
                    pb: 0.5, transition: 'all 0.2s',
                    '&:hover': { fontWeight: 700 },
                  }}
                >
                  {item}
                </Box>
              ))}
            </Box>
          )}

          {/* CENTER logo */}
          <Link href="/" style={{ textDecoration: 'none', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            <Box
              component="img"
              src="/logo.png"
              alt="Nike"
              sx={{
                height: 20,
                width: 'auto',
                objectFit: 'contain',
              }}
            />
          </Link>

          {/* RIGHT icons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 1.5 } }}>
            {!isMobile && (
              <IconButton sx={{ color: '#000' }}>
                <PersonOutlineIcon sx={{ fontSize: 22 }} />
              </IconButton>
            )}
            <IconButton sx={{ color: '#000' }}>
              <SearchIcon sx={{ fontSize: 22 }} />
            </IconButton>
            <Link href="/cart" style={{ color: 'inherit' }}>
              <IconButton sx={{ color: '#000' }}>
                <Badge
                  badgeContent={totalItems}
                  color="error"
                  sx={{ '& .MuiBadge-badge': { fontSize: 10, minWidth: 16, height: 16 } }}
                >
                  <ShoppingBagOutlinedIcon sx={{ fontSize: 22 }} />
                </Badge>
              </IconButton>
            </Link>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{ sx: { width: '100%', maxWidth: 375 } }}
      >
        <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e8e8e8', position: 'relative' }}>
          <IconButton onClick={() => setDrawerOpen(false)} sx={{ p: 0.5 }}>
            <CloseIcon sx={{ fontSize: 24 }} />
          </IconButton>
          <Typography sx={{ fontWeight: 800, fontSize: 15, letterSpacing: '0.04em', position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
            YOUR<span style={{ fontWeight: 800 }}>SNEAKER</span>
          </Typography>
          <Link href="/cart" style={{ color: 'inherit' }} onClick={() => setDrawerOpen(false)}>
            <IconButton sx={{ color: '#000', p: 0.5 }}>
              <Badge badgeContent={totalItems} color="error">
                <ShoppingBagOutlinedIcon sx={{ fontSize: 22 }} />
              </Badge>
            </IconButton>
          </Link>
        </Box>

        <Box sx={{ px: 3, py: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2, color: '#aaa' }}>
            <SearchIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontSize: 14, letterSpacing: '0.1em', color: '#aaa' }}>SEARCH</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 3, color: '#aaa' }}>
            <PersonOutlineIcon sx={{ fontSize: 20 }} />
            <Typography sx={{ fontSize: 14, letterSpacing: '0.1em', color: '#aaa' }}>LOGIN</Typography>
          </Box>
          <Divider sx={{ mb: 3 }} />
          <List disablePadding>
            {DRAWER_NAV.map((item, i) => (
              <ListItem key={item} disablePadding sx={{ mb: 0.5 }} onClick={() => setDrawerOpen(false)}>
                <Typography
                  sx={{
                    fontSize: 16, letterSpacing: '0.06em', color: '#000', cursor: 'pointer',
                    fontWeight: i === 0 ? 800 : 400,
                    borderBottom: i === 0 ? '2px solid #000' : 'none',
                    pb: i === 0 ? 0.5 : 0, mb: 1.5,
                    '&:hover': { fontWeight: 700 },
                  }}
                >
                  {item}
                </Typography>
              </ListItem>
            ))}
          </List>
        </Box>

        <Box sx={{ mt: 'auto', p: 4, display: 'flex', justifyContent: 'center' }}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/assets/footer_nike_logo.png" alt="Nike" style={{ height: 48, opacity: 0.85 }} />
        </Box>
      </Drawer>
    </>
  );
}
