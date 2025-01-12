import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import process from "process";
import path from "path";
import {
  errorHandler,
  handle404ErrorRoutes,
  handlePromiseRejections,
  handleUncaughtExceptions,
} from "./middleware/errorMiddleware.js";

// Import routes
import blogRoutes from "./routes/blogRoutes.js";
import packageRoutes from "./routes/packageRoutes.js";
import bookingRoutes from "./routes/bookingRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";

dotenv.config(); //Load environment variables
const app = express(); //Initialize Express app
const __dirname = path.resolve(); // Node.js global directory

//Handle uncaught exceptions and unhandled promise rejections (process-level errors)
handleUncaughtExceptions();
handlePromiseRejections();

//Middleware for request parsing, CORS, etc.
app.use(
  cors({
    origin: "*", // Allow requests from frontend
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
app.use(bodyParser.json());
app.use(express.json());

//Routes
app.use("/api", userRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api", packageRoutes);
app.use("/api/book", bookingRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api/admin", adminRoutes);

// Basic route
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use(handle404ErrorRoutes); // Handle 404 routes
app.use(errorHandler); //Global error-handling middleware

// MongoDB connection string
const MONGODB_URI = process.env.MONGODB_URI || MONGODB_URI_PRODUCTION;

mongoose.set("strictQuery", false);
mongoose
  .connect(MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

//Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
