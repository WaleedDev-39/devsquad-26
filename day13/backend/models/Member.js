// In-memory member store
const members = [
  {
    id: 1,
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    role: 'Full Stack Developer',
    avatar: '',
    skills: ['React', 'Node.js', 'MongoDB'],
    projectIds: [1, 3],
    createdAt: new Date().toISOString(),
  },
  {
    id: 2,
    name: 'James Wilson',
    email: 'james@example.com',
    role: 'Backend Developer',
    avatar: '',
    skills: ['Python', 'Django', 'PostgreSQL'],
    projectIds: [1],
    createdAt: new Date().toISOString(),
  },
  {
    id: 3,
    name: 'Emily Chen',
    email: 'emily@example.com',
    role: 'AI Engineer',
    avatar: '',
    skills: ['Python', 'TensorFlow', 'FastAPI'],
    projectIds: [2],
    createdAt: new Date().toISOString(),
  },
  {
    id: 4,
    name: 'Michael Brown',
    email: 'michael@example.com',
    role: 'UI/UX Designer',
    avatar: '',
    skills: ['Figma', 'CSS', 'GSAP'],
    projectIds: [],
    createdAt: new Date().toISOString(),
  },
];
let nextId = 5;

const MemberModel = {
  getAll: () => members,
  findById: (id) => members.find((m) => m.id === id),
  findByEmail: (email) => members.find((m) => m.email === email),
  create: (data) => {
    const member = {
      id: nextId++,
      ...data,
      projectIds: data.projectIds || [],
      createdAt: new Date().toISOString(),
    };
    members.push(member);
    return member;
  },
  update: (id, data) => {
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) return null;
    members[index] = { ...members[index], ...data, updatedAt: new Date().toISOString() };
    return members[index];
  },
  delete: (id) => {
    const index = members.findIndex((m) => m.id === id);
    if (index === -1) return false;
    members.splice(index, 1);
    return true;
  },
  getCount: () => members.length,
};

module.exports = MemberModel;
