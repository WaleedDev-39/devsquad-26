import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env vars
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/shopco';

async function fix() {
  console.log('Connecting to MongoDB at', MONGO_URI);
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected!');

    // The error says collection is ecom.carts or shopco.carts depending on URI. 
    // Let's get the carts collection
    const db = mongoose.connection.db;
    
    // Sometimes the URI has no db name and it defaults to 'test', or process.env has a different URI.
    // Let's drop the index from 'carts' collection directly.
    const collection = db.collection('carts');
    
    console.log('Fetching indexes...');
    const indexes = await collection.indexes();
    console.log('Current indexes:', indexes.map(i => i.name));

    for (const index of indexes) {
      if (index.name === 'user_1' || index.name === 'userId_1') {
        console.log(`Dropping index ${index.name}...`);
        await collection.dropIndex(index.name);
        console.log(`Dropped ${index.name}`);
      }
    }

    console.log('Successfully cleaned up indexes!');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected.');
  }
}

fix();
