import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Snackbar,
  Alert,
  Tooltip,
  InputAdornment,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Code as CodeIcon,
  FolderCopy as FolderIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import gsap from 'gsap';
import { projectsAPI } from '../services/api';

const statusColors = {
  active: { bg: 'rgba(34,197,94,0.15)', color: '#22c55e', label: 'Active' },
  completed: { bg: 'rgba(245,158,11,0.15)', color: '#f59e0b', label: 'Completed' },
};

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [form, setForm] = useState({ title: '', description: '', techStack: '', status: 'active' });
  const [search, setSearch] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const cardsRef = useRef([]);
  const dialogRef = useRef(null);
  const pageRef = useRef(null);

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Animate cards on mount
    if (cardsRef.current.length > 0) {
      gsap.fromTo(
        cardsRef.current.filter(Boolean),
        { opacity: 0, y: 60, scale: 0.9 },
        {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.6,
          stagger: 0.1,
          ease: 'power3.out',
          delay: 0.2,
        }
      );
    }
  }, [projects]);

  const fetchProjects = async () => {
    try {
      const res = await projectsAPI.getAll();
      setProjects(res.data.data);
    } catch {
      showSnackbar('Failed to fetch projects', 'error');
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenDialog = (project = null) => {
    if (project) {
      setSelectedProject(project);
      setForm({
        title: project.title,
        description: project.description,
        techStack: (project.techStack || []).join(', '),
        status: project.status,
      });
    } else {
      setSelectedProject(null);
      setForm({ title: '', description: '', techStack: '', status: 'active' });
    }
    setDialogOpen(true);

    // Animate dialog
    setTimeout(() => {
      if (dialogRef.current) {
        gsap.fromTo(
          dialogRef.current,
          { opacity: 0, scale: 0.85, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.7)' }
        );
      }
    }, 50);
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        ...form,
        techStack: form.techStack
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      };

      if (selectedProject) {
        await projectsAPI.update(selectedProject.id, payload);
        showSnackbar('Project updated successfully! 🎉');
      } else {
        await projectsAPI.create(payload);
        showSnackbar('Project created successfully! 🚀');
      }

      setDialogOpen(false);
      fetchProjects();
    } catch (err) {
      showSnackbar(err.response?.data?.message || 'Failed to save project', 'error');
    }
  };

  const handleDelete = async () => {
    try {
      await projectsAPI.delete(selectedProject.id);
      showSnackbar('Project deleted');
      setDeleteDialogOpen(false);
      setSelectedProject(null);

      // Animate removal
      fetchProjects();
    } catch {
      showSnackbar('Failed to delete project', 'error');
    }
  };

  const filtered = projects.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box ref={pageRef} sx={{ minHeight: '100vh', pb: 8 }}>
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
              Projects
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage and track all your team projects
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
            New Project
          </Button>
        </Box>

        {/* Search */}
        <TextField
          fullWidth
          placeholder="Search projects..."
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

        {/* Project Cards Grid */}
        <Grid container spacing={3}>
          {filtered.map((project, i) => (
            <Grid item xs={12} sm={6} lg={4} key={project.id}>
              <Card
                ref={(el) => (cardsRef.current[i] = el)}
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  '&:hover': {
                    transform: 'translateY(-8px) scale(1.02)',
                    boxShadow: (theme) =>
                      theme.palette.mode === 'dark'
                        ? '0 20px 50px rgba(124,77,255,0.15)'
                        : '0 20px 50px rgba(0,0,0,0.1)',
                    '& .card-icon': { transform: 'rotate(10deg) scale(1.1)' },
                  },
                }}
              >
                <CardContent sx={{ flex: 1, p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                    <Box
                      className="card-icon"
                      sx={{
                        width: 44,
                        height: 44,
                        borderRadius: 2.5,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(124,77,255,0.15), rgba(0,229,255,0.1))',
                        transition: 'transform 0.3s ease',
                      }}
                    >
                      <FolderIcon sx={{ color: 'primary.main' }} />
                    </Box>
                    <Chip
                      label={statusColors[project.status]?.label}
                      size="small"
                      sx={{
                        bgcolor: statusColors[project.status]?.bg,
                        color: statusColors[project.status]?.color,
                        fontWeight: 600,
                        fontSize: '0.75rem',
                      }}
                    />
                  </Box>

                  <Typography variant="h6" fontWeight={700} sx={{ mb: 1 }}>
                    {project.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      mb: 2,
                      display: '-webkit-box',
                      WebkitLineClamp: 3,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      lineHeight: 1.6,
                    }}
                  >
                    {project.description}
                  </Typography>

                  {/* Tech Stack */}
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                    {(project.techStack || []).slice(0, 4).map((tech, j) => (
                      <Chip
                        key={j}
                        label={tech}
                        size="small"
                        icon={<CodeIcon sx={{ fontSize: '14px !important' }} />}
                        variant="outlined"
                        sx={{
                          fontSize: '0.7rem',
                          height: 26,
                          borderColor: 'divider',
                          '& .MuiChip-icon': { color: 'primary.main' },
                        }}
                      />
                    ))}
                  </Box>

                  <Typography variant="caption" color="text.secondary">
                    {(project.teamMembers || []).length} team member{(project.teamMembers || []).length !== 1 ? 's' : ''}
                  </Typography>
                </CardContent>

                <CardActions sx={{ px: 3, pb: 2.5, pt: 0 }}>
                  <Button
                    size="small"
                    startIcon={<EditIcon />}
                    onClick={(e) => { e.stopPropagation(); handleOpenDialog(project); }}
                    sx={{ fontWeight: 600 }}
                  >
                    Edit
                  </Button>
                  <Button
                    size="small"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                      setDeleteDialogOpen(true);
                    }}
                    sx={{ fontWeight: 600 }}
                  >
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>

        {filtered.length === 0 && (
          <Box sx={{ textAlign: 'center', py: 10, opacity: 0.6 }}>
            <FolderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h6" color="text.secondary">
              {search ? 'No projects match your search' : 'No projects yet — create your first one!'}
            </Typography>
          </Box>
        )}
      </Container>

      {/* Add/Edit Dialog */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ ref: dialogRef }}
      >
        <DialogTitle sx={{ fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {selectedProject ? 'Edit Project' : 'Create New Project'}
          <IconButton onClick={() => setDialogOpen(false)} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pt: '16px !important' }}>
          <TextField
            fullWidth
            label="Project Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{ mb: 2.5 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            sx={{ mb: 2.5 }}
          />
          <TextField
            fullWidth
            label="Tech Stack"
            placeholder="React, Node.js, MongoDB..."
            value={form.techStack}
            onChange={(e) => setForm({ ...form, techStack: e.target.value })}
            helperText="Separate technologies with commas"
            sx={{ mb: 2.5 }}
          />
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={form.status}
              label="Status"
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <MenuItem value="active">🟢 Active</MenuItem>
              <MenuItem value="completed">🟡 Completed</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDialogOpen(false)} color="inherit">Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={!form.title || !form.description}
          >
            {selectedProject ? 'Update' : 'Create'} Project
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Delete Project?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete <strong>{selectedProject?.title}</strong>? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={() => setDeleteDialogOpen(false)} color="inherit">Cancel</Button>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
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
