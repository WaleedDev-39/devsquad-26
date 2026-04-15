const mongoose = require("mongoose");

let isConnected = false;

// Disable Mongoose buffering to fail fast when not connected
mongoose.set("bufferCommands", false);

const connectMongoDB = async (url) => {
  if (isConnected) {
    return;
  }
  try {
    await mongoose.connect(url, {
      serverSelectionTimeoutMS: 5000, // stop trying quickly if MongoDB is unreachable
      socketTimeoutMS: 45000,
      family: 4, // use IPv4 (helps some environments)
    });
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

module.exports = {
  connectMongoDB,
};
