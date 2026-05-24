const mongoose = require("mongoose");

let cachedPromise = null;

async function connectDB() {
  const url = process.env.MONGODB_URL;
  
  if (mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  if (!cachedPromise) {
    console.log("Creating new MongoDB connection...");
    cachedPromise = mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000,
    }).then((mongooseInstance) => {
      console.log("MongoDB Connected successfully!");
      return mongooseInstance;
    }).catch(err => {
      cachedPromise = null;
      console.error("MongoDB connection failed:", err);
      throw err;
    });
  }

  return await cachedPromise;
}

module.exports = connectDB;
