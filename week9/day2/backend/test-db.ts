import { MongoClient } from 'mongodb';
import * as dotenv from 'dotenv';
dotenv.config();

async function checkDb() {
  const url = process.env.MONGODB_URL || '';
  const dbName = process.env.DB_NAME || 'cricket_db';
  console.log(`Connecting to ${url}`);
  const client = new MongoClient(url);
  try {
    await client.connect();
    console.log(`Connected. Checking db: ${dbName}`);
    const db = client.db(dbName);
    for (const col of ['test', 'odi', 't20']) {
      const count = await db.collection(col).countDocuments();
      console.log(`Collection '${col}' count: ${count}`);
    }
  } catch (err) {
    console.error('DB Error:', err);
  } finally {
    await client.close();
  }
}

checkDb();
