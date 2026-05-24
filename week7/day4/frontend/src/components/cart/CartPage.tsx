'use client';
import {
  Box, Typography, IconButton, Divider, Button,
  CircularProgress, Skeleton,
} from '@mui/material';
import { AddIcon, RemoveIcon, CloseIcon, ArrowBackIcon } from '@/components/shared/Icons';
import Link from 'next/link';
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
} from '@/services/cartApi';

export default function CartPage() {
  const { data: cart, isLoading } = useGetCartQuery();
  const [updateItem] = useUpdateCartItemMutation();
  const [removeItem] = useRemoveFromCartMutation();

  const subtotal = cart?.items?.reduce((sum, item) => sum + item.price * item.quantity, 0) || 0;

  const handleQuantity = async (productId: string, current: number, delta: number, size?: string, color?: string) => {
    const newQty = current + delta;
    if (newQty <= 0) {
      await removeItem({ productId, size, color });
    } else {
      await updateItem({ productId, quantity: newQty, size, color });
    }
  };

  const handleRemove = async (productId: string, size?: string, color?: string) => {
    await removeItem({ productId, size, color });
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', px: { xs: 2, md: 4 }, py: { xs: 4, md: 6 } }}>
      {/* Back link */}
      <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, color: '#555', '&:hover': { color: '#000' } }}>
          <ArrowBackIcon sx={{ fontSize: 18 }} />
          <Typography sx={{ fontSize: 13, fontWeight: 500 }}>Continue Shopping</Typography>
        </Box>
      </Link>

      <Typography variant="h4" sx={{ fontWeight: 900, fontSize: { xs: 24, md: 32 }, mb: 0.5, textTransform: 'uppercase', fontStyle: 'italic' }}>
        Your Cart
      </Typography>
      <Typography sx={{ color: '#888', fontSize: 13, mb: 4 }}>
        {cart?.items?.length || 0} item{cart?.items?.length !== 1 ? 's' : ''} in your bag
      </Typography>

      {isLoading && (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} variant="rectangular" height={100} sx={{ borderRadius: 2 }} />
          ))}
        </Box>
      )}

      {!isLoading && (!cart?.items || cart.items.length === 0) && (
        <Box sx={{ textAlign: 'center', py: 8, bgcolor: '#f7f7f7', borderRadius: 3 }}>
          <Typography sx={{ fontSize: 48, mb: 2 }}>👟</Typography>
          <Typography sx={{ fontWeight: 700, fontSize: 20, mb: 1 }}>Your cart is empty</Typography>
          <Typography sx={{ color: '#888', mb: 3, fontSize: 14 }}>Add some sneakers to get started!</Typography>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <Button variant="contained" sx={{ bgcolor: '#000', color: '#fff', px: 4, py: 1.2, borderRadius: 2, textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#333' } }}>
              Shop Now
            </Button>
          </Link>
        </Box>
      )}

      {!isLoading && cart?.items && cart.items.length > 0 && (
        <>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mb: 4 }}>
            {cart.items.map((item) => (
              <Box
                key={`${item.productId}-${item.size}-${item.color}`}
                sx={{
                  display: 'flex', alignItems: 'center', gap: 2,
                  bgcolor: '#f7f7f7', borderRadius: 3, p: { xs: 1.5, md: 2 },
                  transition: 'box-shadow 0.2s',
                  '&:hover': { boxShadow: '0 4px 16px rgba(0,0,0,0.08)' },
                }}
              >
                {/* Image */}
                <Box sx={{ width: { xs: 72, md: 90 }, height: { xs: 72, md: 90 }, flexShrink: 0, bgcolor: '#ebebeb', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 8 }} />
                </Box>

                {/* Info */}
                <Box sx={{ flex: 1, minWidth: 0 }}>
                  <Typography sx={{ fontWeight: 700, fontSize: { xs: 13, md: 14 }, mb: 0.3, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.name}
                  </Typography>
                  {item.size && <Typography sx={{ fontSize: 11, color: '#888' }}>Size: {item.size}</Typography>}
                  {item.color && <Typography sx={{ fontSize: 11, color: '#888' }}>Color: {item.color}</Typography>}
                  <Typography sx={{ fontWeight: 700, fontSize: 14, mt: 0.5 }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                </Box>

                {/* Qty controls */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <IconButton size="small" onClick={() => handleQuantity(item.productId, item.quantity, -1, item.size, item.color)}
                    sx={{ bgcolor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', width: 28, height: 28, '&:hover': { bgcolor: '#000', color: '#fff' }, transition: 'all 0.15s' }}>
                    <RemoveIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                  <Typography sx={{ fontWeight: 700, fontSize: 14, minWidth: 24, textAlign: 'center' }}>{item.quantity}</Typography>
                  <IconButton size="small" onClick={() => handleQuantity(item.productId, item.quantity, 1, item.size, item.color)}
                    sx={{ bgcolor: '#fff', boxShadow: '0 1px 4px rgba(0,0,0,0.1)', width: 28, height: 28, '&:hover': { bgcolor: '#000', color: '#fff' }, transition: 'all 0.15s' }}>
                    <AddIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </Box>

                {/* Remove */}
                <IconButton size="small" onClick={() => handleRemove(item.productId, item.size, item.color)}
                  sx={{ color: '#aaa', '&:hover': { color: '#ff2d00' }, transition: 'color 0.2s', ml: 0.5 }}>
                  <CloseIcon sx={{ fontSize: 18 }} />
                </IconButton>
              </Box>
            ))}
          </Box>

          <Divider sx={{ mb: 3 }} />

          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography sx={{ fontSize: 14, color: '#555' }}>Subtotal</Typography>
            <Typography sx={{ fontWeight: 700, fontSize: 20 }}>${subtotal.toFixed(2)}</Typography>
          </Box>
          <Typography sx={{ fontSize: 11, color: '#aaa', mb: 3, textAlign: 'right' }}>
            Taxes and shipping calculated at checkout
          </Typography>

          <Button fullWidth variant="contained" disabled
            sx={{ bgcolor: '#000', color: '#fff', py: 1.8, fontSize: 14, fontWeight: 700, borderRadius: 2, textTransform: 'none', letterSpacing: '0.04em', '&.Mui-disabled': { bgcolor: '#222', color: '#888' } }}>
            Checkout — Coming Soon
          </Button>
        </>
      )}
    </Box>
  );
}
