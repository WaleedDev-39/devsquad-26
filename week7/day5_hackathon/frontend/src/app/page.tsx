'use client';
import AppShell from '@/components/AppShell';
import {
  Box, Grid, Card, CardContent, Typography, Chip, Avatar,
  Table, TableBody, TableCell, TableHead, TableRow, CircularProgress, Alert,
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import InventoryIcon from '@mui/icons-material/Inventory2';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { useGetDashboardQuery } from '@/store/apis/dashboardApi';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  LineChart, Line, CartesianGrid,
} from 'recharts';

function StatCard({ label, value, icon, color, sub }: any) {
  return (
    <Card>
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Avatar sx={{ bgcolor: `${color}22`, width: 52, height: 52 }}>
          <Box sx={{ color }}>{icon}</Box>
        </Avatar>
        <Box sx={{ flex: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 500 }}>{label}</Typography>
          <Typography variant="h5" sx={{ fontWeight: 800 }} color="text.primary">{value}</Typography>
          {sub && <Typography variant="caption" color="text.secondary">{sub}</Typography>}
        </Box>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const { data, isLoading, isError } = useGetDashboardQuery(undefined, { pollingInterval: 15000 });

  if (isLoading) return (
    <AppShell>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>
    </AppShell>
  );

  if (isError || !data) return (
    <AppShell>
      <Alert severity="error" sx={{ mt: 4 }}>Failed to load dashboard. Make sure the backend is running.</Alert>
    </AppShell>
  );

  const { stats, lowStockMaterials = [], topProducts = [], dailySales = [], recentOrders = [] } = data || {};

  const safeDailySales = Array.isArray(dailySales) ? dailySales : [];
  const chartData = safeDailySales.map((d: any) => ({
    date: (d._id || '').slice(5),
    revenue: d.revenue || 0,
    orders: d.orders || 0,
  }));

  return (
    <AppShell>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h4" sx={{ fontWeight: 800 }} color="primary.dark">Dashboard</Typography>
        <Typography color="text.secondary">Real-time business overview</Typography>
      </Box>

      {/* Stats */}
      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Total Revenue" value={`$${(stats?.totalRevenue || 0).toFixed(2)}`} icon={<TrendingUpIcon />} color="#4F46E5" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Total Orders" value={stats?.totalOrders || 0} icon={<ShoppingCartIcon />} color="#06B6D4" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard label="Products" value={stats?.totalProducts || 0} icon={<InventoryIcon />} color="#10B981" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            label="Low Stock Alerts"
            value={stats?.lowStockCount || 0}
            icon={<WarningAmberIcon />}
            color="#F59E0B"
            sub={(stats?.lowStockCount || 0) > 0 ? 'Action required' : 'All good!'}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2.5} sx={{ mb: 3 }}>
        {/* Revenue Chart */}
        <Grid size={{ xs: 12, lg: 8 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Revenue (Last 14 days)</Typography>
              {chartData.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No sales data yet — make your first sale!</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={240}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0FF" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip formatter={(v: any) => [`$${v}`, 'Revenue']} />
                    <Line type="monotone" dataKey="revenue" stroke="#4F46E5" strokeWidth={3} dot={{ fill: '#4F46E5', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Top Products */}
        <Grid size={{ xs: 12, lg: 4 }}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Top Products</Typography>
              {Array.isArray(topProducts) && topProducts.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No sales yet</Typography>
              ) : (
                <Box>
                  {(topProducts || []).map((p: any, i: number) => (
                    <Box key={p._id} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                      <Avatar sx={{ width: 28, height: 28, bgcolor: i === 0 ? '#4F46E5' : '#E8EAFF', color: i === 0 ? '#fff' : '#4F46E5', fontSize: 13, fontWeight: 700 }}>
                        {i + 1}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>{p.productName}</Typography>
                        <Typography variant="caption" color="text.secondary">{p.totalSold} sold</Typography>
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 700 }} color="primary">${(p.totalRevenue || 0).toFixed(0)}</Typography>
                    </Box>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={2.5}>
        {/* Orders Bar Chart */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Daily Orders</Typography>
              {chartData.length === 0 ? (
                <Typography color="text.secondary" sx={{ py: 4, textAlign: 'center' }}>No orders yet</Typography>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F0F0FF" />
                    <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="orders" fill="#06B6D4" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Low Stock */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>⚠️ Low Stock Alerts</Typography>
              {Array.isArray(lowStockMaterials) && lowStockMaterials.length === 0 ? (
                <Alert severity="success">All raw materials are sufficiently stocked.</Alert>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Material</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Current</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Min Level</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(lowStockMaterials || []).map((m: any) => (
                      <TableRow key={m._id}>
                        <TableCell>{m.name}</TableCell>
                        <TableCell>{m.currentStock} {m.unit}</TableCell>
                        <TableCell>{m.minimumStockAlert} {m.unit}</TableCell>
                        <TableCell>
                          <Chip label={m.currentStock === 0 ? 'Out of Stock' : 'Low'} color={m.currentStock === 0 ? 'error' : 'warning'} size="small" />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Recent Orders */}
        <Grid size={{ xs: 12 }}>
          <Card>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>Recent Orders</Typography>
              {Array.isArray(recentOrders) && recentOrders.length === 0 ? (
                <Typography color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>No orders placed yet. Head to POS to make your first sale!</Typography>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Order #</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(recentOrders || []).map((o: any) => (
                      <TableRow key={o._id}>
                        <TableCell><Typography sx={{ fontWeight: 700 }} color="primary">{o.orderNumber}</Typography></TableCell>
                        <TableCell>{(o.items || []).map((i: any) => `${i.productName} ×${i.quantity}`).join(', ')}</TableCell>
                        <TableCell sx={{ fontWeight: 700 }}>${(o.totalAmount || 0).toFixed(2)}</TableCell>
                        <TableCell><Chip label={o.status} color="success" size="small" /></TableCell>
                        <TableCell>{new Date(o.createdAt).toLocaleDateString()}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </AppShell>
  );
}
