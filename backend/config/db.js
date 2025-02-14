import mongoose from "mongoose";

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/test";

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`✅ Successfully connected to MongoDB`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error:`, error);
    process.exit(1);
  }
};

// Handle MongoDB connection events
mongoose.connection.on("disconnected", () => {
  console.warn("⚠️ MongoDB Disconnected! Retrying...");
  connectDB();
});

mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB Connection Error:", err);
});

mongoose.connection.on("reconnected", () => {
  console.log("🔄 MongoDB Reconnected!");
});

export default connectDB;
