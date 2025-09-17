import http, { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";

let server: Server | null = null;

// Database connection
async function connectToDatabase() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log("🛢 Database connected successfully");
  } catch (err) {
    console.error("❌ Failed to connect to database:", err);
    process.exit(1);
  }
}

// Graceful shutdown
function gracefulShutdown(signal: string) {
  console.log(`📦 Received ${signal}. Closing server...`);
  if (server) {
    server.close(() => {
      console.log("✅ Server closed gracefully");
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

// Application bootstrap
async function bootstrap() {
  try {
    await connectToDatabase();

    // Create HTTP server from Express app
    const httpServer = http.createServer(app);

    // Start server
    server = httpServer.listen(config.port, () => {
      console.log(`🚀 Server running on port ${config.port}`);
    });

    // Listen for termination signals
    process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
    process.on("SIGINT", () => gracefulShutdown("SIGINT"));

    // Handle uncaught errors
    process.on("uncaughtException", (error) => {
      console.error("❗ Uncaught Exception:", error);
      gracefulShutdown("uncaughtException");
    });

    process.on("unhandledRejection", (error) => {
      console.error("❗ Unhandled Rejection:", error);
      gracefulShutdown("unhandledRejection");
    });
  } catch (error) {
    console.error("❌ Error during bootstrap:", error);
    process.exit(1);
  }
}

bootstrap();
