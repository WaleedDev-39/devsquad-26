import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  IconButton,
  Snackbar,
  Alert,
  Paper,
  Grid,
  Chip,
  Avatar,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  Checkbox,
  ListItemText,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Work as WorkIcon,
  Close as CloseIcon,
  Assignment as AssignIcon,
} from '@mui/icons-material';
import gsap from 'gsap';
import { membersAPI, projectsAPI } from '../services/api';

const avatarColors = [
  '#7c4dff', '#00e5ff', '#ff4081', '#22c55e', '#f59e0b',
  '#ef4444', '#8b5cf6', '#06b6d4', '#84cc16', '#ec4899',
];

export default function Members() {
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [assignProjectId, setAssignProjectId] = useState('');
  const [form, setForm] = useState({ name: '', email: '', role: '', skills: '' });
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const cardsRef = useRef([]);
  const dialogRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { opacity: 0, y: 40, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.08, ease: 'power3.out', delay: 0.2 }
      );
    }
  }, [members]);

  const fetchData = async () => {
    try {
      const [memRes, projRes] = await Promise.all([membersAPI.getAll(), projectsAPI.getAll()]);
      setMembers(memRes.data.data);
      setProjects(projRes.data.data);
    } catch {
      showSnackbar('Failed to fetch data', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });

    // GSAP notification animation
    setTimeout(() => {
      const el = document.querySelector('.MuiSnackbar-root .MuiAlert-root');
      if (el) {
        gsap.fromTo(el, { scale: 0.8, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(2)' });
      }
    }, 50);
  };

  const handleOpenDialog = (member = null) => {
    if (member) {
      setSelectedMember(member);
      setForm({
        name: member.name,
        email: member.email,
        role: member.role,
        skills: (member.skills || []).join(', '),
      });
    } else {
      setSelectedMember(null);
      setForm({ name: '', email: '', role: '', skills: '' });
    }
    setDialogOpen(true);

    setTimeout(() => {
      if (dialogRef.current) {
        gsap.fromTo(dialogRef.current, { opacity: 0, scale: 0.85, y: 30 }, { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' });
      }
    }, 50);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        skills: form.skills.split(',').map((s) => s.trim()).filter(Boolean),
      };

      if (selectedMember) {
        await membersAPI.update(selectedMember.id, payload);
        showSnackbar('Member updated successfully! ✅');
      } else {
        await membersAPI.create(payload);
        showSnackbar('Member added successfully! 🎉');
      }

      setDialogOpen(false);
      fetchData();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Failed to save member', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await membersAPI.delete(selectedMember.id);

      // Animate the card out
      const cardEl = cardsRef.current.find(Boolean);
      if (cardEl) {
        gsap.to(cardEl, { opacity: 0, x: -50, duration: 0.3, ease: 'power2.in' });
      }

      showSnackbar('Member removed');
      setDeleteDialogOpen(false);
      setSelectedMember(null);
      fetchData();
    } catch {
      showSnackbar('Failed to delete member', 'error');
    }
  };

  const handleAssign = async () => {
    try {
      const res = await membersAPI.assign(selectedMember.id, assignProjectId);
      showSnackbar(res.data.message + ' 🔗');
      setAssignDialogOpen(false);
      fetchData();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Failed to assign', 'error');
    }
  };

  const getProjectNames = (projectIds) => {
    return (projectIds || [])
      .map((id) => projects.find((p) => p.id === id)?.title)
      .filter(Boolean);
  };

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.role.toLowerCase().includes(search.toLowerCase()) ||
      m.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ minHeight: '100vh', pb: 8 }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: { xs: 'flex-start', sm: 'center' },
            justifyContent: 'space-between',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 2,
            mb: 4,
          }}
        >
          <Box>
            <Typography variant="h4" fontWeight={800} sx={{ mb: 0.5 }}>
              Team Members
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your team and assign them to projects
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              px: 3,
              boxShadow: '0 8px 25px rgba(124,77,255,0.3)',
              '&:hover': { boxShadow: '0 12px 35px rgba(124,77,255,0.4)' },
            }}
          >
            Add Member
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search members..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          sx={{ mb: 4 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: 'text.secondary' }} />
              </InputAdornment>
            ),
          }}
        />

        {/* Member Cards */}
        <Grid container spacing={3}>
          {filtered.map((member, i) => (
            <Grid item xs={12} sm={6} lg={4} key={member.id}>
              <Paper
                ref={(el) => (cardsRef.current[i] = el)}
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-6px)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 16px 40px rgba(124,77,255,0.12)'
                        : '0 16px 40px rgba(0,0,0,0.08)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2.5 }}>
                  <Avatar
                    sx={{
                      width: 52,
                      height: 52,
                      bgcolor: avatarColors[i % avatarColors.length],
                      fontWeight: 700,
                      fontSize: 20,
                    }}
                  >
                    {member.name.charAt(0).toUpperCase()}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography variant="subtitle1" fontWeight={700} noWrap>
                      {member.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {member.role}
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
                  <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary" noWrap>
                    {member.email}
                  </Typography>
                </Box>

                {/* Skills */}
                {member.skills && member.skills.length > 0 && (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {member.skills.slice(0, 4).map((skill, j) => (
                      <Chip
                        key={j}
                        label={skill}
                        size="small"
                        variant="outlined"
                        sx={{ fontSize: '0.7rem', height: 24, borderColor: 'divider' }}
                      />
                    ))}
                  </Box>
                )}

                {/* Assigned Projects */}
                {getProjectNames(member.projectIds).length > 0 && (
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ display: 'block', mb: 0.5 }}>
                      Assigned Projects
                    </Typography>
                    {getProjectNames(member.projectIds).map((name, j) => (
                      <Chip
                        key={j}
                        label={name}
                        size="small"
                        sx={{
                          mr: 0.5,
                          mb: 0.5,
                          fontSize: '0.7rem',
                          height: 24,
                          bgcolor: 'rgba(124,77,255,0.1)',
                          color: 'primary.main',
                        }}
                      />
                    ))}
                  </Box>
                )}

                {/* Actions */}
                <Box sx={{ display: 'flex', gap: 1, mt: 'auto' }}>
                  <Button
                    size="small"
                    startIcon={<AssignIcon />}
                    onClick={() => { setSelectedMember(member); setAssignDialogOpen(true); }}
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  >
                    Assign
                  </Button>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={() => handleOpenDialog(member)}
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => { setSelectedMember(member); setDeleteDialogOpen(true); }}
                    sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                  >
                    Delete
                  </Button>
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10, opacity: 0.6 }}>
            <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {search ? 'No members match your search' : 'No team members yet — add your first one!'}
            </Typography>
          </Box>
        )}
      </Container>

      {/* Add/Edit Member Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth PaperProps={{ ref: dialogRef }}>
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {selectedMember ? 'Edit Member' : 'Add Team Member'}
          <IconButton onClick={() => setDialogOpen(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <TextField
            fullWidth
            label="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            sx={{ mb: 2.5 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }}
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={{ mb: 2.5 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><EmailIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }}
          />
          <TextField
            fullWidth
            label="Role"
            placeholder="e.g. Frontend Developer"
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            sx={{ mb: 2.5 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><WorkIcon sx={{ color: 'text.secondary' }} /></InputAdornment> }}
          />
          <TextField
            fullWidth
            label="Skills"
            placeholder="React, Node.js, Python..."
            value={form.skills}
            onChange={(e) => setForm({ ...form, skills: e.target.value })}
            helperText="Separate skills with commas"
          />
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleSubmit} disabled={!form.name || !form.email || !form.role}>
            {selectedMember ? 'Update' : 'Add'} Member
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Remove Member?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to remove <strong>{selectedMember?.name}</strong> from the team?
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>Remove</Button>
        </DialogActions>
      </Dialog>

      {/* Assign to Project Dialog */}
      <Dialog open={assignDialogOpen} onClose={() => setAssignDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>
          Assign {selectedMember?.name} to Project
        </DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <FormControl fullWidth>
            <InputLabel>Select Project</InputLabel>
            <Select
              value={assignProjectId}
              label="Select Project"
              onChange={(e) => setAssignProjectId(e.target.value)}
            >
              {projects.map((p) => (
                <MenuItem key={p.id} value={p.id}>{p.title}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setAssignDialogOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" onClick={handleAssign} disabled={!assignProjectId}>
            Assign
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          sx={{ borderRadius: 3, fontWeight: 600 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
