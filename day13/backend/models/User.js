// In-memory user store
const users = [];
let nextId = 1;

const UserModel = {
  findByEmail: (email) => users.find((u) => u.email === email),
  findById: (id) => users.find((u) => u.id === id),
  create: (userData) => {
    const user = { id: nextId++, ...userData, createdAt: new Date().toISOString() };
    users.push(user);
    return user;
  },
  getAll: () => users.map(({ password, ...u }) => u),
};

module.exports = UserModel;
