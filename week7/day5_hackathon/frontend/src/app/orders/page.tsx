'use client';
import AppShell from '@/components/AppShell';
import {
  Box, Typography, Card, Table, TableBody, TableCell, TableHead, TableRow,
  Chip, CircularProgress, Alert, Collapse, IconButton, Avatar, Divider,
} from '@mui/material';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import { useGetOrdersQuery } from '@/store/apis/ordersApi';
import { useState } from 'react';

function OrderRow({ order }: { order: any }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <TableRow hover sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton size="small" onClick={() => setOpen(!open)}>
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        <TableCell>
          <Typography fontWeight={700} color="primary">{order.orderNumber}</Typography>
        </TableCell>
        <TableCell>{order.items.length} item{order.items.length !== 1 ? 's' : ''}</TableCell>
        <TableCell>
          <Typography fontWeight={700}>${order.totalAmount.toFixed(2)}</Typography>
        </TableCell>
        <TableCell>
          <Chip label={order.status} color="success" size="small" sx={{ fontWeight: 600 }} />
        </TableCell>
        <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
        <TableCell>{order.notes || '—'}</TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ m: 2, p: 2, bgcolor: '#F8FAFF', borderRadius: 2, border: '1px solid #E8EAFF' }}>
              <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="primary">
                Order Items
              </Typography>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Unit Price</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Qty</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Subtotal</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {order.items.map((item: any, i: number) => (
                    <TableRow key={i}>
                      <TableCell fontWeight={600}>{item.productName}</TableCell>
                      <TableCell>${item.unitPrice.toFixed(2)}</TableCell>
                      <TableCell>{item.quantity}</TableCell>
                      <TableCell fontWeight={700} color="primary.main">${item.subtotal.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={3} align="right" sx={{ fontWeight: 800, borderTop: '2px solid #E8EAFF' }}>
                      Total
                    </TableCell>
                    <TableCell sx={{ fontWeight: 800, borderTop: '2px solid #E8EAFF', color: '#4F46E5' }}>
                      ${order.totalAmount.toFixed(2)}
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default function OrdersPage() {
  const { data: orders = [], isLoading, isError } = useGetOrdersQuery(undefined);

  const totalRevenue = orders.reduce((s: number, o: any) => s + o.totalAmount, 0);

  if (isLoading) return (
    <AppShell>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
    </AppShell>
  );

  return (
    <AppShell>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="primary.dark">Orders History</Typography>
          <Typography color="text.secondary">All completed sales transactions</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Card sx={{ px: 2.5, py: 1.5 }}>
            <Typography variant="caption" color="text.secondary" display="block">Total Orders</Typography>
            <Typography variant="h5" fontWeight={800} color="primary">{orders.length}</Typography>
          </Card>
          <Card sx={{ px: 2.5, py: 1.5 }}>
            <Typography variant="caption" color="text.secondary" display="block">Total Revenue</Typography>
            <Typography variant="h5" fontWeight={800} color="success.main">${totalRevenue.toFixed(2)}</Typography>
          </Card>
        </Box>
      </Box>

      {isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to load orders.</Alert>}

      <Card>
        {orders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <Avatar sx={{ width: 64, height: 64, bgcolor: '#EEF2FF', mx: 'auto', mb: 2 }}>
              <ReceiptLongIcon sx={{ color: '#4F46E5', fontSize: 32 }} />
            </Avatar>
            <Typography variant="h6" color="text.secondary" fontWeight={600}>No Orders Yet</Typography>
            <Typography color="text.disabled" mt={1}>Head over to the POS screen to make your first sale!</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#F8FAFF' }}>
                <TableCell width={48} />
                <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date & Time</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Notes</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order: any) => (
                <OrderRow key={order._id} order={order} />
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </AppShell>
  );
}
