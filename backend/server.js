import http from "http";
import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./config/db.js";
import configureMiddleware from "./config/middleware.js";
import errorHandler from "./middlewares/errorHandler.js";
import rateLimiter from "./middlewares/rateLimiter.js";
import authRoutes from "./routes/authRoutes.js";
import incidentRoutes from "./routes/incidentRoutes.js";
import initializeSocket from "./config/socket.js";
import fetchIncidents from "./utils/fetchIncidents.js";

// ✅ Load environment variables
dotenv.config();

// ✅ Connect to MongoDB before starting the server
connectDB()
  .then(() => {
    console.log("✅ MongoDB Connected. Starting server...");

    // ✅ Initialize Express App
    const app = express();
    const server = http.createServer(app);

    // ✅ Initialize WebSocket Server
    const io = initializeSocket(server);

    // ✅ Middleware
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());
    app.use(cors({ credentials: true }));
    app.use(rateLimiter);

    configureMiddleware(app);

    // ✅ Routes
    app.use("/api/users", authRoutes);
    app.use("/incidents", incidentRoutes);

    // ✅ Start Fetching Incidents
    fetchIncidents(io);

    // ✅ Global Error Handler
    app.use(errorHandler);

    // 🚀 Start the Server
    const PORT = process.env.PORT || 5001;
    server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((error) => {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  });

// ✅ Graceful Shutdown Handling
process.on("SIGINT", async () => {
  console.log("⚠️ Shutting down server...");
  try {
    await mongoose.connection.close();
    console.log("✅ MongoDB connection closed.");
  } catch (error) {
    console.error("❌ Error during shutdown:", error.message);
  }
  process.exit(0);
});
