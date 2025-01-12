// Import required modules
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import process from "process";
import path from "path";

// Import routes
import blogRoutes from "./routes/blog.js";
import packageRoutes from "./routes/package.js";
import bookingRoutes from "./routes/booking.js";
import contactRoutes from "./routes/contact.js";
import userRoutes from "./routes/user.js"; // Import user routes
import admin from "./routes/admin.js";

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

const __dirname = path.resolve(); // Node.js global directory

// Middleware setup
app.use(
  cors({
    origin: "*", // Allow requests from frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(express.json());

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || MONGODB_URI_PRODUCTION;

// Connect to MongoDB
mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World");
});

// Register routes
// Register routes
app.use("/api", userRoutes); // Using the user routes for handling user-related requests
// Other routes for blogs, packages, bookings, etc. can be registered here.
app.use("/api/blogs", blogRoutes);
app.use("/api", packageRoutes);
app.use("/api/book", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", admin);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: "Something went wrong!",
    error: process.env.NODE_ENV === "development" ? err.message : undefined,
  });
});

// Handle 404 routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle uncaught exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  // Gracefully shutdown the server
  process.exit(1);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
  // Gracefully shutdown the server
  process.exit(1);
});
