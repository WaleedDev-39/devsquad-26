// In-memory project store
const projects = [
  {
    id: 1,
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce platform with payment integration, product management, and user authentication.',
    techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
    status: 'active',
    teamMembers: [1, 2],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    title: 'AI Chat Assistant',
    description: 'An intelligent chatbot powered by OpenAI GPT for customer support automation.',
    techStack: ['Python', 'FastAPI', 'React', 'OpenAI'],
    status: 'active',
    teamMembers: [3],
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description: 'A sleek, animated portfolio website with GSAP animations and dark mode support.',
    techStack: ['React', 'GSAP', 'MUI', 'Vite'],
    status: 'completed',
    teamMembers: [1],
    createdAt: new Date().toISOString(),
  },
];
let nextId = 4;

const ProjectModel = {
  getAll: () => projects,
  findById: (id) => projects.find((p) => p.id === id),
  create: (data) => {
    const project = {
      id: nextId++,
      ...data,
      teamMembers: data.teamMembers || [],
      createdAt: new Date().toISOString(),
    };
    projects.push(project);
    return project;
  },
  update: (id, data) => {
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    projects[index] = { ...projects[index], ...data, updatedAt: new Date().toISOString() };
    return projects[index];
  },
  delete: (id) => {
    const index = projects.findIndex((p) => p.id === id);
    if (index === -1) return false;
    projects.splice(index, 1);
    return true;
  },
  getStats: () => ({
    total: projects.length,
    active: projects.filter((p) => p.status === 'active').length,
    completed: projects.filter((p) => p.status === 'completed').length,
  }),
};

module.exports = ProjectModel;
