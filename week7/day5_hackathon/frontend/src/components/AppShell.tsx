'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText,
  AppBar, Toolbar, Typography, IconButton, Avatar, Badge, Chip, Divider,
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import InventoryIcon from '@mui/icons-material/Inventory2';
import BlenderIcon from '@mui/icons-material/Blender';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { useGetLowStockMaterialsQuery } from '@/store/apis/rawMaterialsApi';

const DRAWER_WIDTH = 260;

const navItems = [
  { label: 'Dashboard',     href: '/',              icon: <DashboardIcon /> },
  { label: 'Raw Materials', href: '/raw-materials', icon: <InventoryIcon /> },
  { label: 'Products',      href: '/products',      icon: <BlenderIcon /> },
  { label: 'POS',           href: '/pos',           icon: <PointOfSaleIcon /> },
  { label: 'Orders',        href: '/orders',        icon: <ReceiptLongIcon /> },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: lowStock = [] } = useGetLowStockMaterialsQuery(undefined);

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: DRAWER_WIDTH,
            boxSizing: 'border-box',
            background: 'linear-gradient(180deg, #4F46E5 0%, #3730A3 100%)',
            color: '#fff',
            border: 'none',
          },
        }}
      >
        {/* Logo */}
        <Box sx={{ p: 3, pb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 0.5 }}>
            <Box sx={{
              width: 40, height: 40, borderRadius: 2,
              background: 'rgba(255,255,255,0.2)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <PointOfSaleIcon sx={{ color: '#fff', fontSize: 22 }} />
            </Box>
            <Box>
              <Typography variant="h6" sx={{ color: '#fff', lineHeight: 1.1, fontWeight: 800 }}>
                StockPOS
              </Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                Inventory · Sales
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.15)', mx: 2 }} />

        {/* Nav */}
        <List sx={{ px: 1.5, pt: 1.5, flex: 1 }}>
          {navItems.map(({ label, href, icon }) => {
            const active = pathname === href || (href !== '/' && pathname.startsWith(href));
            return (
              <ListItem key={href} disablePadding sx={{ mb: 0.5 }}>
                <ListItemButton
                  component={Link}
                  href={href}
                  sx={{
                    borderRadius: 2,
                    color: active ? '#fff' : 'rgba(255,255,255,0.65)',
                    background: active ? 'rgba(255,255,255,0.18)' : 'transparent',
                    '&:hover': { background: 'rgba(255,255,255,0.12)', color: '#fff' },
                    py: 1.2,
                  }}
                >
                  <ListItemIcon sx={{ color: 'inherit', minWidth: 40 }}>{icon}</ListItemIcon>
                  <ListItemText
                    primary={label}
                    primaryTypographyProps={{ fontWeight: active ? 700 : 500, fontSize: 14 }}
                  />
                  {label === 'Raw Materials' && lowStock.length > 0 && (
                    <Chip
                      label={lowStock.length}
                      size="small"
                      sx={{
                        bgcolor: '#EF4444', color: '#fff', height: 20,
                        fontSize: 11, fontWeight: 700, '& .MuiChip-label': { px: 1 },
                      }}
                    />
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>

        {/* Footer */}
        <Box sx={{ p: 2 }}>
          <Box sx={{
            p: 1.5, borderRadius: 2,
            background: 'rgba(255,255,255,0.1)',
            display: 'flex', alignItems: 'center', gap: 1.5,
          }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'rgba(255,255,255,0.3)', fontSize: 14 }}>A</Avatar>
            <Box>
              <Typography variant="caption" sx={{ color: '#fff', fontWeight: 600, display: 'block' }}>Admin</Typography>
              <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>Manager</Typography>
            </Box>
          </Box>
        </Box>
      </Drawer>

      {/* Main area */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Top bar */}
        <AppBar
          position="sticky"
          elevation={0}
          sx={{
            bgcolor: '#fff',
            borderBottom: '1px solid #E8EAFF',
            color: 'text.primary',
          }}
        >
          <Toolbar sx={{ justifyContent: 'flex-end', gap: 1 }}>
            <IconButton size="small">
              <Badge badgeContent={lowStock.length || null} color="error">
                <NotificationsIcon sx={{ color: '#6B7280' }} />
              </Badge>
            </IconButton>
          </Toolbar>
        </AppBar>

        {/* Page content */}
        <Box sx={{ flex: 1, p: { xs: 2, md: 3 } }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}
