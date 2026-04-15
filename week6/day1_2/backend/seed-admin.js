const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const MONGO_URI = process.env.MONGODB_URI;
const adminEmail = 'admin@shopco.com';
const adminPassword = 'admin123';

async function seed() {
  console.log('Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected.');
 
    const hp = await bcrypt.hash(adminPassword, 10);
    const result = await mongoose.connection.collection('users').updateOne(
      { email: adminEmail },
      { 
        $set: { 
          name: 'Super Admin', 
          email: adminEmail, 
          password: hp, 
          role: 'admin', 
          isActive: true, 
          updatedAt: new Date() 
        } 
      },
      { upsert: true }
    );

    console.log('Admin user created or updated successfully.');
    console.log('Credentials:');
    console.log('Email: ' + adminEmail);
    console.log('Password: ' + adminPassword);
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  }
}

seed();
