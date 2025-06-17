const express = require("express");
const path = require("path");
const router = require("./app/router");

const app = express();

app.use(express.json("/", (req, res) => 
app.use(express.static(path.join(__dirname, "public"))); // Serve static files

// Mount all API routes at /api/routes
app.use("/app/routes", router);

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
