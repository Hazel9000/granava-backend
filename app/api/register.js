// api/register.js
const express = require('express');
const bcrypt = require('bcryptjs');

const router = express.Router();

// In-memory users storage for example purposes
const users = [];

router.post('/register', async (req, res) => {
  const { name, email, phone, company, password } = req.body;

  // Basic validation
  if (!name || !email || !phone || !password) {
    return res.json({ success: false, message: 'All required fields must be filled.' });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.json({ success: false, message: 'Email is already registered.' });
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create new user object
  const newUser = {
    id: users.length + 1,
    name,
    email,
    phone,
    company: company || '',
    password: hashedPassword,
    createdAt: new Date()
  };

  users.push(newUser);

  // Return user object without password
  const userWithoutPassword = { ...newUser };
  delete userWithoutPassword.password;

  res.json({ success: true, user: userWithoutPassword });
});

module.exports = router;
