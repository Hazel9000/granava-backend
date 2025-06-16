const express = require("express");
const path = require("path");
const router = require("./app/router");

const app = express();

app.use(express.json("/", (req, res) => {
  res.send("Welcome to Granava backend");
});

app.use("/api/hello", (req, res) => {
  res.json({ message: "Hello World" });));
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Mount all API routes at /api
app.use("/api", router);

// 404 for non-API, non-static
app.use((req, res) => {
  res.status(404).send("Not found");
});

const PORT = process.env.PORT || 5000;

// For Vercel, export app instead of listening
if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT, () => console.log(`Server running on ${PORT}`));
} else {
  module.exports = app;
}
