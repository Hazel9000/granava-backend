const express = require("express");
const router = express.Router();

// GET /api/users/
router.get("/", (req, res) => {
  res.json([{ id: 1, username: "demo" }]);
});

// POST /api/users/register
router.post("/register", (req, res) => {
  const { username, password, email } = req.body;
  if (!username || !password || !email) {
    return res.status(400).json({ error: "Please provide username, email, and password." });
  }
  // Add user registration logic here...
  res.status(201).json({ message: "User registered!", user: { username, email } });
});

module.exports = router;
