// api/register.js (Vercel Serverless Function style)
const bcrypt = require('bcryptjs');

let users = []; // In-memory users array (will reset on every serverless invocation)

export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ success: false, message: 'Method Not Allowed' });
  }

  const { name, email, phone, company, password } = req.body;

  // Basic validation
  if (!name || !email || !phone || !password) {
    return res.status(400).json({ success: false, message: 'All required fields must be filled.' });
  }

  // Check if user already exists
  const existingUser = users.find(user => user.email === email);
  if (existingUser) {
    return res.status(400).json({ success: false, message: 'Email is already registered.' });
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
  const { password: _, ...userWithoutPassword } = newUser;

  return res.status(200).json({ success: true, user: userWithoutPassword });
}
