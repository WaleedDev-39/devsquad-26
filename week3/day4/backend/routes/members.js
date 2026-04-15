const express = require('express');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');
const MemberModel = require('../models/Member');
const ProjectModel = require('../models/Project');

const router = express.Router();

// GET /members — Get all members
router.get('/', auth, (req, res) => {
  const members = MemberModel.getAll();
  res.json({ success: true, data: members });
});

// GET /members/count — Get member count
router.get('/count', auth, (req, res) => {
  const count = MemberModel.getCount();
  res.json({ success: true, data: { count } });
});

// GET /members/:id — Get single member
router.get('/:id', auth, (req, res) => {
  const member = MemberModel.findById(parseInt(req.params.id));
  if (!member) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }
  res.json({ success: true, data: member });
});

// POST /members — Create member
router.post(
  '/',
  auth,
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('role').trim().notEmpty().withMessage('Role is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { name, email, role, skills, projectIds } = req.body;

    // Check if email already exists
    if (MemberModel.findByEmail(email)) {
      return res.status(400).json({ success: false, message: 'Email already exists' });
    }

    const member = MemberModel.create({
      name,
      email,
      role,
      skills: skills || [],
      projectIds: projectIds || [],
    });

    res.status(201).json({ success: true, data: member, message: 'Member added successfully' });
  }
);

// PUT /members/:id — Update member
router.put(
  '/:id',
  auth,
  [
    body('name').optional().trim().notEmpty().withMessage('Name cannot be empty'),
    body('email').optional().isEmail().withMessage('Valid email is required'),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const member = MemberModel.update(parseInt(req.params.id), req.body);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }

    res.json({ success: true, data: member, message: 'Member updated successfully' });
  }
);

// DELETE /members/:id — Delete member
router.delete('/:id', auth, (req, res) => {
  const deleted = MemberModel.delete(parseInt(req.params.id));
  if (!deleted) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }
  res.json({ success: true, message: 'Member deleted successfully' });
});

// POST /members/:id/assign — Assign member to project
router.post('/:id/assign', auth, (req, res) => {
  const { projectId } = req.body;
  const memberId = parseInt(req.params.id);

  const member = MemberModel.findById(memberId);
  if (!member) {
    return res.status(404).json({ success: false, message: 'Member not found' });
  }

  const project = ProjectModel.findById(parseInt(projectId));
  if (!project) {
    return res.status(404).json({ success: false, message: 'Project not found' });
  }

  // Add project to member
  if (!member.projectIds.includes(parseInt(projectId))) {
    member.projectIds.push(parseInt(projectId));
  }

  // Add member to project
  if (!project.teamMembers.includes(memberId)) {
    project.teamMembers.push(memberId);
  }

  res.json({
    success: true,
    message: `${member.name} assigned to ${project.title}`,
    data: { member, project },
  });
});

module.exports = router;
