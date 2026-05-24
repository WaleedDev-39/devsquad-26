const mongoose = require('mongoose');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;

async function check() {
  try {
    await mongoose.connect(MONGO_URI);
    const users = await mongoose.connection.collection('users').find({}).toArray();
    console.log('--- USERS IN DB ---');
    users.forEach(u => {
      console.log(`- ${u.email} (Role: ${u.role}, Active: ${u.isActive})`);
    });
    console.log('-------------------');
  } catch (err) {
    console.error(err);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

check();
