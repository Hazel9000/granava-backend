const express = require("express");
const path = require("path");
const router = require("./router");

const app = express();

// Parse JSON bodies
app.use(express.json());

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));

// Mount all API routes at /app/routes
app.use("/app/routes", router);

// 404 handler for unmatched routes
app.use((req, res) => {
  res.status(404).send("Not found");
});

// Do NOT call app.listen() for Vercel. Just export the app:
module.exports = app;
