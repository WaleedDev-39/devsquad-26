const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const ProjectModel = require('../models/Project');

const router = express.Router();

// GET /projects — Get all projects
router.get('/', auth, (req, res) => {
  const projects = ProjectModel.getAll();
  res.json({ success: true, data: projects });
});

// GET /projects/stats — Get project statistics
router.get('/stats', auth, (req, res) => {
  const stats = ProjectModel.getStats();
  res.json({ success: true, data: stats });
});

// GET /projects/:id — Get single project
router.get('/:id', auth, (req, res) => {
  const project = ProjectModel.findById(parseInt(req.params.id));
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.json({ success: true, data: project });
});

// POST /projects — Create project
router.post(
  '/',
  auth,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('status').isIn(['active', 'completed']).withMessage('Status must be active or completed'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { title, description, techStack, status, teamMembers } = req.body;
    const project = ProjectModel.create({
      title,
      description,
      techStack: techStack || [],
      status: status || 'active',
      teamMembers: teamMembers || [],
    });

    res.status(201).json({ success: true, data: project, message: 'Project created successfully' });
  }
);

// PUT /projects/:id — Update project
router.put(
  '/:id',
  auth,
  [
    body('title').optional().trim().notEmpty().withMessage('Title cannot be empty'),
    body('status').optional().isIn(['active', 'completed']).withMessage('Invalid status'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const project = ProjectModel.update(parseInt(req.params.id), req.body);
    if (!project) {
      return res.status(404).json({ success: false, message: 'Project not found' });
    }

    res.json({ success: true, data: project, message: 'Project updated successfully' });
  }
);

// DELETE /projects/:id — Delete project
router.delete('/:id', auth, (req, res) => {
  const deleted = ProjectModel.delete(parseInt(req.params.id));
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }
  res.json({ success: true, message: 'Project deleted successfully' });
});

module.exports = router;
