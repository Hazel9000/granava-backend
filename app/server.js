const express = require("express");
const path = require("path");
const morgan = require("morgan");
const cors = require("cors");
const router = require("./app/router");

const app = express();

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, "public")));

// Enable CORS for all routes (customize origin in production)
app.use(cors());

// HTTP request logger middleware
app.use(morgan("dev"));

// Middleware to parse JSON bodies
app.use(express.json());

// Mount the central router
app.use(router);

// Catch-all for 404 Not Found (API only)
app.use((req, res, next) => {
  // If the request accepts HTML, forward to static file handler (for SPA)
  if (req.accepts("html")) {
    return res.status(404).sendFile(path.join(__dirname, "public", "index.html"));
  }
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
