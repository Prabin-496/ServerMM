// errorMiddleware.js
export const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined, // Show stack trace only in development
  });
};

export const handle404ErrorRoutes = (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
};

// Handle uncaught exceptions
export const handleUncaughtExceptions = () => {
  process.on("uncaughtException", (err) => {
    console.error("Uncaught Exception:", err);
    // Gracefully shutdown the server
    process.exit(1);
  });
};

// Handle unhandled promise rejections
export const handlePromiseRejections = () => {
  process.on("unhandledRejection", (err) => {
    console.error("Unhandled Rejection:", err);
    // Gracefully shutdown the server
    process.exit(1);
  });
};
