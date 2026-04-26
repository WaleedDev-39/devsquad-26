'use client';
import AppShell from '@/components/AppShell';
import { useState } from 'react';
import {
  Box, Typography, Button, Card, CardContent, Grid, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField, Stack, Alert,
  CircularProgress, Divider, Avatar, Tooltip, MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';
import BlenderIcon from '@mui/icons-material/Blender';
import { useGetProductsQuery, useCreateProductMutation, useUpdateProductMutation, useDeleteProductMutation } from '@/store/apis/productsApi';
import { useGetRawMaterialsQuery } from '@/store/apis/rawMaterialsApi';

const EMPTY_PRODUCT = { name: '', price: 0, description: '', category: '', recipe: [] as any[] };

export default function ProductsPage() {
  const { data: products = [], isLoading } = useGetProductsQuery(undefined);
  const { data: rawMaterials = [] } = useGetRawMaterialsQuery(undefined);
  const [create] = useCreateProductMutation();
  const [update] = useUpdateProductMutation();
  const [remove] = useDeleteProductMutation();

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState<any>(EMPTY_PRODUCT);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const openAdd = () => { setEditing(null); setForm(EMPTY_PRODUCT); setError(''); setOpen(true); };
  const openEdit = (p: any) => {
    setEditing(p);
    setForm({
      name: p.name, price: p.price, description: p.description || '', category: p.category || '',
      recipe: p.recipe.map((r: any) => ({ rawMaterial: r.rawMaterial._id || r.rawMaterial, quantity: r.quantity })),
    });
    setError(''); setOpen(true);
  };

  const addIngredient = () => setForm((f: any) => ({ ...f, recipe: [...f.recipe, { rawMaterial: '', quantity: 0 }] }));
  const removeIngredient = (i: number) => setForm((f: any) => ({ ...f, recipe: f.recipe.filter((_: any, idx: number) => idx !== i) }));
  const updateIngredient = (i: number, field: string, val: any) => {
    setForm((f: any) => {
      const r = [...f.recipe]; r[i] = { ...r[i], [field]: val }; return { ...f, recipe: r };
    });
  };

  const handleSave = async () => {
    setSaving(true); setError('');
    try {
      // Filter out incomplete ingredients before sending
      const cleanRecipe = form.recipe
        .filter((r: any) => r.rawMaterial && r.rawMaterial !== '')
        .map((r: any) => ({
          rawMaterial: r.rawMaterial,
          quantity: Number(r.quantity)
        }));

      const payload = { 
        ...form, 
        price: Number(form.price), 
        recipe: cleanRecipe 
      };

      if (editing) await update({ id: editing._id, ...payload }).unwrap();
      else await create(payload).unwrap();
      setOpen(false);
    } catch (e: any) {
      setError(e?.data?.message || JSON.stringify(e?.data) || 'Error saving product');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await remove(id).unwrap();
  };

  if (isLoading) return <AppShell><Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box></AppShell>;

  return (
    <AppShell>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="primary.dark">Products & Recipes</Typography>
          <Typography color="text.secondary">Define products and their raw material composition</Typography>
        </Box>
        <Button variant="contained" startIcon={<AddIcon />} onClick={openAdd} size="large">Add Product</Button>
      </Box>

      {products.length === 0 && (
        <Alert severity="info">No products yet. Create a product and define its raw material recipe.</Alert>
      )}

      <Grid container spacing={2.5}>
        {products.map((p: any) => (
          <Grid item xs={12} sm={6} lg={4} key={p._id}>
            <Card sx={{ height: '100%', position: 'relative' }}>
              <CardContent>
                {/* Header */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <Avatar sx={{ bgcolor: '#EEF2FF', color: '#4F46E5', width: 42, height: 42 }}>
                      <BlenderIcon fontSize="small" />
                    </Avatar>
                    <Box>
                      <Typography fontWeight={700} lineHeight={1.2}>{p.name}</Typography>
                      {p.category && <Chip label={p.category} size="small" sx={{ mt: 0.5, bgcolor: '#F0FDFA', color: '#0891B2' }} />}
                    </Box>
                  </Box>
                  <Box>
                    <Tooltip title="Edit"><IconButton size="small" color="primary" onClick={() => openEdit(p)}><EditIcon fontSize="small" /></IconButton></Tooltip>
                    <Tooltip title="Delete"><IconButton size="small" color="error" onClick={() => handleDelete(p._id)}><DeleteIcon fontSize="small" /></IconButton></Tooltip>
                  </Box>
                </Box>

                {/* Price + Stock */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip label={`$${p.price.toFixed(2)}`} sx={{ bgcolor: '#EEF2FF', color: '#4F46E5', fontWeight: 700 }} />
                  <Chip
                    label={p.availableStock > 0 ? `${p.availableStock} available` : 'Out of stock'}
                    color={p.availableStock > 0 ? 'success' : 'error'}
                    size="small"
                  />
                </Box>

                {p.description && <Typography variant="body2" color="text.secondary" mb={1.5}>{p.description}</Typography>}

                {/* Recipe */}
                <Divider sx={{ mb: 1.5 }} />
                <Typography variant="caption" fontWeight={700} color="text.secondary" sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
                  Recipe ({p.recipe?.length || 0} ingredients)
                </Typography>
                <Box sx={{ mt: 1 }}>
                  {p.recipe?.map((r: any, i: number) => (
                    <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', py: 0.4 }}>
                      <Typography variant="body2" color="text.secondary">{r.rawMaterial?.name || 'Unknown'}</Typography>
                      <Typography variant="body2" fontWeight={600}>{r.quantity} {r.rawMaterial?.unit}</Typography>
                    </Box>
                  ))}
                  {(!p.recipe || p.recipe.length === 0) && <Typography variant="caption" color="text.disabled">No ingredients defined</Typography>}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Add/Edit Dialog */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="md" fullWidth>
        <DialogTitle fontWeight={700}>{editing ? 'Edit Product' : 'Create Product'}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            {error && <Grid item xs={12}><Alert severity="error">{error}</Alert></Grid>}
            <Grid item xs={12} sm={6}>
              <TextField label="Product Name" fullWidth value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Price ($)" type="number" fullWidth value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
            </Grid>
            <Grid item xs={6} sm={3}>
              <TextField label="Category" fullWidth value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} />
            </Grid>
            <Grid item xs={12}>
              <TextField label="Description (optional)" fullWidth multiline rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            </Grid>

            {/* Recipe */}
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography fontWeight={700}>Recipe / Ingredients</Typography>
                <Button startIcon={<AddCircleOutlinedIcon />} size="small" onClick={addIngredient}>Add Ingredient</Button>
              </Box>
              <Stack spacing={1.5}>
                {form.recipe.map((r: any, i: number) => (
                  <Box key={i} sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <TextField
                      select fullWidth label="Raw Material" value={r.rawMaterial || ''}
                      onChange={(e) => updateIngredient(i, 'rawMaterial', e.target.value)}
                    >
                      <MenuItem value=""><em>Select...</em></MenuItem>
                      {rawMaterials.map((m: any) => (
                        <MenuItem key={m._id} value={m._id}>{m.name} ({m.unit})</MenuItem>
                      ))}
                    </TextField>
                    <TextField
                      label="Qty" type="number" sx={{ width: 100 }} value={r.quantity}
                      onChange={(e) => updateIngredient(i, 'quantity', e.target.value)}
                    />
                    <IconButton color="error" onClick={() => removeIngredient(i)}><RemoveCircleIcon /></IconButton>
                  </Box>
                ))}
                {form.recipe.length === 0 && (
                  <Typography variant="body2" color="text.disabled" sx={{ py: 1 }}>
                    No ingredients added yet. Click "Add Ingredient" above.
                  </Typography>
                )}
              </Stack>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 2.5 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={saving}>
            {saving ? 'Saving...' : editing ? 'Update' : 'Create'}
          </Button>
        </DialogActions>
      </Dialog>
    </AppShell>
  );
}
