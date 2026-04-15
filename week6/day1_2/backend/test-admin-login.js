const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;

async function testLogin() {
  try {
    await mongoose.connect(MONGO_URI);
    const adminEmail = 'admin@shopco.com';
    const adminPassword = 'admin123';

    const user = await mongoose.connection.collection('users').findOne({ email: adminEmail });
    if (!user) {
      console.log('User not found!');
      return;
    }

    console.log('User found:', user.email);
    console.log('Stored Hash:', user.password);

    const valid = await bcrypt.compare(adminPassword, user.password);
    console.log('Password valid:', valid);

  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

testLogin();
