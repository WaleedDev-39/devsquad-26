'use client';
import AppShell from '@/components/AppShell';
import { useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Table, TableBody, TableCell,
  TableHead, TableRow, Chip, IconButton, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Select, MenuItem, FormControl, InputLabel,
  CircularProgress, Alert, Tooltip, Stack,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import {
  useGetRawMaterialsQuery,
  useCreateRawMaterialMutation,
  useUpdateRawMaterialMutation,
  useDeleteRawMaterialMutation,
  useRestockRawMaterialMutation,
} from '@/store/apis/rawMaterialsApi';

const UNITS = ['g', 'ml', 'pcs', 'kg', 'l', 'oz'];
const EMPTY = { name: '', unit: 'g', currentStock: 0, minimumStockAlert: 0 };

export default function RawMaterialsPage() {
  const { data: materials = [], isLoading, isError } = useGetRawMaterialsQuery(undefined);
  const [create] = useCreateRawMaterialMutation();
  const [update] = useUpdateRawMaterialMutation();
  const [remove] = useDeleteRawMaterialMutation();
  const [restock] = useRestockRawMaterialMutation();

  const [open, setOpen] = useState(false);
  const [restockOpen, setRestockOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY);
  const [restockQty, setRestockQty] = useState(0);
  const [restockId, setRestockId] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const openAdd = () => { setEditing(null); setForm(EMPTY); setError(''); setOpen(true); };
  const openEdit = (m: any) => { setEditing(m); setForm({ name: m.name, unit: m.unit, currentStock: m.currentStock, minimumStockAlert: m.minimumStockAlert }); setError(''); setOpen(true); };
  const openRestock = (m: any) => { setRestockId(m._id); setRestockQty(0); setRestockOpen(true); };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      if (editing) await update({ id: editing._id, ...form }).unwrap();
      else await create(form).unwrap();
      setOpen(false);
    } catch (e: any) {
      setError(e?.data?.message || 'Error saving');
    } finally { setSaving(false); }
  };

  const handleRestock = async () => {
    await restock({ id: restockId, quantity: Number(restockQty) }).unwrap();
    setRestockOpen(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this raw material?')) return;
    await remove(id).unwrap();
  };

  if (isLoading) return <AppShell><Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box></AppShell>;

  return (
    <AppShell>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="primary.dark">Raw Materials</Typography>
          <Typography color="text.secondary">Manage your inventory ingredients</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} size="large">
          Add Material
        </Button>
      </Box>

      {isError && <Alert severity="error" sx={{ mb: 2 }}>Failed to load materials. Is the backend running?</Alert>}

      <Card>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#F8FAFF' }}>
              <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Unit</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Current Stock</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Min Alert</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {materials.length === 0 && (
              <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: 'text.secondary' }}>No raw materials yet. Add your first one!</TableCell></TableRow>
            )}
            {materials.map((m: any) => {
              const isLow = m.minimumStockAlert > 0 && m.currentStock <= m.minimumStockAlert;
              return (
                <TableRow key={m._id} hover>
                  <TableCell fontWeight={600}>{m.name}</TableCell>
                  <TableCell><Chip label={m.unit} size="small" sx={{ bgcolor: '#EEF2FF', color: '#4F46E5', fontWeight: 700 }} /></TableCell>
                  <TableCell>
                    <Typography fontWeight={700} color={m.currentStock === 0 ? 'error' : 'text.primary'}>
                      {m.currentStock.toLocaleString()}
                    </Typography>
                  </TableCell>
                  <TableCell>{m.minimumStockAlert || '—'}</TableCell>
                  <TableCell>
                    {m.currentStock === 0 ? <Chip label="Out of Stock" color="error" size="small" /> :
                      isLow ? <Chip label="Low Stock" color="warning" size="small" /> :
                        <Chip label="OK" color="success" size="small" />}
                  </TableCell>
                  <TableCell>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Restock">
                        <IconButton size="small" color="success" onClick={() => openRestock(m)}>
                          <AddCircleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" color="primary" onClick={() => openEdit(m)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete">
                        <IconButton size="small" color="error" onClick={() => handleDelete(m._id)}>
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight={700}>{editing ? 'Edit Raw Material' : 'Add Raw Material'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            {error && <Alert severity="error">{error}</Alert>}
            <TextField label="Name" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <FormControl fullWidth>
              <InputLabel>Unit</InputLabel>
              <Select value={form.unit} label="Unit" onChange={(e) => setForm({ ...form, unit: e.target.value })}>
                {UNITS.map((u) => <MenuItem key={u} value={u}>{u}</MenuItem>)}
              </Select>
            </FormControl>
            <TextField label="Current Stock" type="number" fullWidth value={form.currentStock}
              onChange={(e) => setForm({ ...form, currentStock: Number(e.target.value) })} />
            <TextField label="Minimum Stock Alert (optional)" type="number" fullWidth value={form.minimumStockAlert}
              onChange={(e) => setForm({ ...form, minimumStockAlert: Number(e.target.value) })} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Restock Dialog */}
      <Dialog open={restockOpen} onClose={() => setRestockOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle fontWeight={700}>Restock Material</DialogTitle>
        <DialogContent>
          <TextField label="Quantity to Add" type="number" fullWidth sx={{ mt: 1 }}
            value={restockQty} onChange={(e) => setRestockQty(Number(e.target.value))} />
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setRestockOpen(false)}>Cancel</Button>
          <Button variant="contained" color="success" onClick={handleRestock}>Restock</Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
}
