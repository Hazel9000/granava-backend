const express = require('express');
const router = express.Router();

// Import route modules
const authRoutes = require('./auth');
const bookingRoutes = require('./bookings');
const contactRoutes = require('./contact');

// Use route modules
router.use('/auth', authRoutes);
router.use('/bookings', bookingRoutes);
router.use('/contact', contactRoutes);

module.exports = router;