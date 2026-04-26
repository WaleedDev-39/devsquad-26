'use client';
import AppShell from '@/components/AppShell';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '@/store';
import { addToCart, incrementItem, decrementItem, removeFromCart, clearCart } from '@/store/slices/cartSlice';
import { useGetProductsQuery } from '@/store/apis/productsApi';
import { useCreateOrderMutation } from '@/store/apis/ordersApi';
import {
  Box, Typography, Grid, Card, CardContent, Button, IconButton, Divider,
  Chip, Avatar, TextField, Alert, CircularProgress, Badge, Stack, Snackbar,
  Paper,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import PointOfSaleIcon from '@mui/icons-material/PointOfSale';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BlenderIcon from '@mui/icons-material/Blender';
import SearchIcon from '@mui/icons-material/Search';
import { useState } from 'react';

export default function POSPage() {
  const dispatch = useDispatch();
  const cartItems = useSelector((s: RootState) => s.cart.items);
  const { data: products = [], isLoading, refetch } = useGetProductsQuery(undefined);
  const [createOrder, { isLoading: placing }] = useCreateOrderMutation();

  const [search, setSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const filtered = products.filter((p: any) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    (p.category || '').toLowerCase().includes(search.toLowerCase())
  );

  const total = cartItems.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);

  const handleAddToCart = (p: any) => {
    if (p.availableStock <= 0) return;
    dispatch(addToCart({ productId: p._id, productName: p.name, unitPrice: p.price, availableStock: p.availableStock }));
  };

  const handleCompleteSale = async () => {
    if (cartItems.length === 0) return;
    setErrorMsg('');
    try {
      const order = await createOrder({
        items: cartItems.map((i) => ({ product: i.productId, quantity: i.quantity })),
        notes,
      }).unwrap();
      dispatch(clearCart());
      setNotes('');
      setSuccessMsg(`✅ Order ${order.orderNumber} placed! Total: $${order.totalAmount.toFixed(2)}`);
      refetch(); // refresh product stock display
    } catch (e: any) {
      setErrorMsg(e?.data?.message || 'Failed to place order. Check stock availability.');
    }
  };

  return (
    <AppShell>
      <Box sx={{ display: 'flex', gap: 3, height: 'calc(100vh - 110px)' }}>
        {/* Product Grid — left */}
        <Box sx={{ flex: 1, overflow: 'auto', pr: 1 }}>
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="h4" fontWeight={800} color="primary.dark">Point of Sale</Typography>
            <Typography color="text.secondary">Select products to add to cart</Typography>
          </Box>

          {/* Search */}
          <Box sx={{ position: 'relative', mb: 2.5 }}>
            <SearchIcon sx={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'text.secondary' }} />
            <TextField
              fullWidth placeholder="Search products or category..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              sx={{ '& .MuiOutlinedInput-root': { pl: 5.5, bgcolor: '#fff' } }}
              size="small"
            />
          </Box>

          {isLoading && <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}><CircularProgress /></Box>}

          <Grid container spacing={2}>
            {filtered.map((p: any) => {
              const inCart = cartItems.find((i) => i.productId === p._id);
              const outOfStock = p.availableStock <= 0;
              return (
                <Grid item xs={12} sm={6} xl={4} key={p._id}>
                  <Card
                    onClick={() => !outOfStock && handleAddToCart(p)}
                    sx={{
                      cursor: outOfStock ? 'not-allowed' : 'pointer',
                      opacity: outOfStock ? 0.6 : 1,
                      transition: 'all 0.18s ease',
                      border: inCart ? '2px solid #4F46E5' : '2px solid transparent',
                      '&:hover': outOfStock ? {} : {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 24px rgba(79,70,229,0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ pb: '12px !important' }}>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                        <Avatar sx={{ bgcolor: inCart ? '#4F46E5' : '#EEF2FF', color: inCart ? '#fff' : '#4F46E5', mt: 0.5 }}>
                          <BlenderIcon fontSize="small" />
                        </Avatar>
                        <Box flex={1}>
                          <Typography fontWeight={700} lineHeight={1.2}>{p.name}</Typography>
                          {p.category && <Typography variant="caption" color="text.secondary">{p.category}</Typography>}
                          <Box sx={{ display: 'flex', gap: 1, mt: 1, flexWrap: 'wrap' }}>
                            <Chip label={`$${p.price.toFixed(2)}`} size="small" sx={{ bgcolor: '#EEF2FF', color: '#4F46E5', fontWeight: 700 }} />
                            <Chip
                              label={outOfStock ? 'Out of Stock' : `${p.availableStock} avail.`}
                              size="small"
                              color={outOfStock ? 'error' : p.availableStock <= 5 ? 'warning' : 'success'}
                            />
                            {inCart && <Chip label={`In cart: ${inCart.quantity}`} size="small" color="primary" />}
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
            {filtered.length === 0 && !isLoading && (
              <Grid item xs={12}>
                <Typography color="text.secondary" textAlign="center" sx={{ py: 6 }}>
                  {products.length === 0 ? 'No products. Go to Products to create some!' : 'No products match your search.'}
                </Typography>
              </Grid>
            )}
          </Grid>
        </Box>

        {/* Cart — right */}
        <Paper
          elevation={0}
          sx={{
            width: 360,
            flexShrink: 0,
            display: 'flex',
            flexDirection: 'column',
            borderRadius: 3,
            border: '1.5px solid #E8EAFF',
            bgcolor: '#fff',
            overflow: 'hidden',
          }}
        >
          {/* Cart header */}
          <Box sx={{ p: 2.5, borderBottom: '1px solid #E8EAFF', bgcolor: '#F8FAFF' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Badge badgeContent={cartItems.reduce((s, i) => s + i.quantity, 0)} color="primary">
                <PointOfSaleIcon color="primary" />
              </Badge>
              <Typography variant="h6" fontWeight={700}>Current Order</Typography>
            </Box>
          </Box>

          {/* Cart items */}
          <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
            {cartItems.length === 0 && (
              <Box sx={{ textAlign: 'center', py: 6 }}>
                <PointOfSaleIcon sx={{ fontSize: 48, color: '#D1D5DB', mb: 1 }} />
                <Typography color="text.secondary" variant="body2">Cart is empty.<br />Click products to add.</Typography>
              </Box>
            )}
            <Stack spacing={1.5}>
              {cartItems.map((item) => (
                <Box key={item.productId} sx={{ p: 1.5, borderRadius: 2, bgcolor: '#F8FAFF', border: '1px solid #E8EAFF' }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography variant="body2" fontWeight={700} noWrap sx={{ maxWidth: 160 }}>{item.productName}</Typography>
                    <IconButton size="small" onClick={() => dispatch(removeFromCart(item.productId))} sx={{ p: 0.3 }}>
                      <DeleteOutlinedIcon fontSize="small" color="error" />
                    </IconButton>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                      <IconButton size="small" onClick={() => dispatch(decrementItem(item.productId))}
                        sx={{ bgcolor: '#EEF2FF', p: 0.5, '&:hover': { bgcolor: '#E0E7FF' } }}>
                        <RemoveIcon fontSize="small" sx={{ color: '#4F46E5' }} />
                      </IconButton>
                      <Typography fontWeight={700} sx={{ minWidth: 28, textAlign: 'center' }}>{item.quantity}</Typography>
                      <IconButton size="small" onClick={() => dispatch(incrementItem(item.productId))}
                        disabled={item.quantity >= item.availableStock}
                        sx={{ bgcolor: '#EEF2FF', p: 0.5, '&:hover': { bgcolor: '#E0E7FF' } }}>
                        <AddIcon fontSize="small" sx={{ color: '#4F46E5' }} />
                      </IconButton>
                    </Box>
                    <Typography fontWeight={700} color="primary">${(item.unitPrice * item.quantity).toFixed(2)}</Typography>
                  </Box>
                  <Typography variant="caption" color="text.disabled">${item.unitPrice.toFixed(2)} each</Typography>
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Total + Checkout */}
          <Box sx={{ p: 2.5, borderTop: '1px solid #E8EAFF', bgcolor: '#F8FAFF' }}>
            {errorMsg && <Alert severity="error" sx={{ mb: 1.5, fontSize: 12 }} onClose={() => setErrorMsg('')}>{errorMsg}</Alert>}
            <TextField
              label="Order notes (optional)" size="small" fullWidth multiline rows={2}
              value={notes} onChange={(e) => setNotes(e.target.value)}
              sx={{ mb: 2, bgcolor: '#fff' }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6" fontWeight={700}>Total</Typography>
              <Typography variant="h6" fontWeight={800} color="primary">${total.toFixed(2)}</Typography>
            </Box>
            <Button
              variant="contained" fullWidth size="large" disabled={cartItems.length === 0 || placing}
              startIcon={placing ? <CircularProgress size={18} color="inherit" /> : <CheckCircleIcon />}
              onClick={handleCompleteSale}
              sx={{ py: 1.5, fontSize: 16 }}
            >
              {placing ? 'Processing...' : 'Complete Sale'}
            </Button>
            {cartItems.length > 0 && (
              <Button variant="text" color="error" fullWidth sx={{ mt: 1 }} onClick={() => dispatch(clearCart())}>
                Clear Cart
              </Button>
            )}
          </Box>
        </Paper>
      </Box>

      <Snackbar open={!!successMsg} autoHideDuration={5000} onClose={() => setSuccessMsg('')} anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
        <Alert severity="success" sx={{ fontWeight: 700 }}>{successMsg}</Alert>
      </Snackbar>
    </AppShell>
  );
}
