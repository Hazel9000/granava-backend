const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./app/router");

const app = express();

// Enable CORS for all routes (customize origin in production)
app.use(cors());

// HTTP request logger middleware
app.use(morgan("dev"));

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the central router
app.use(router);

// Catch-all for 404 Not Found
app.use((req, res, next) => {
  res.status(404).json({ error: "Not found" });
});

// Error handler middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
