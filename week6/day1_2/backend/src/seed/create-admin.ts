import mongoose from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { join } from 'path';

// Load environment variables
dotenv.config();

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopco';

async function createAdmin() {
  console.log('🚀 Connecting to MongoDB...');
  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected.');

    const adminEmail = 'admin@shopco.com';
    const adminPassword = 'admin123';

    // Check if admin already exists
    const existingAdmin = await mongoose.connection.collection('users').findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log(`⚠️  User with email ${adminEmail} already exists.`);
      console.log('Updating role to "admin" just in case...');
      await mongoose.connection.collection('users').updateOne(
        { email: adminEmail },
        { $set: { role: 'admin' } }
      );
      console.log('✅ Done.');
    } else {
      console.log('Generating password hash...');
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      console.log('Creating Admin user...');
      await mongoose.connection.collection('users').insertOne({
        name: 'Super Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        loyaltyPoints: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log('✅ Admin user created successfully!');
      console.log('-----------------------------------');
      console.log(`Email: ${adminEmail}`);
      console.log(`Password: ${adminPassword}`);
      console.log('-----------------------------------');
    }

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB.');
    process.exit(0);
  }
}

createAdmin();
