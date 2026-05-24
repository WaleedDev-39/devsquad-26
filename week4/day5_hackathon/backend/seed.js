const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI).then(async () => {
  const User = require('./models/User');
  const existingAdmin = await User.findOne({ email: 'admin@streamvibe.com' });
  if (!existingAdmin) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);
    await User.create({
      name: 'Admin User',
      email: 'admin@streamvibe.com',
      password: hashedPassword,
      role: 'admin'
    });
    console.log('Admin user created: admin@streamvibe.com / admin123');
  } else {
    console.log('Admin user already exists');
  }
  process.exit(0);
}).catch(console.error);
