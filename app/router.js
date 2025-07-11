const express = require("express");

// Import route files
const userRoutes = require("../routes/userRoutes");
const bookingRoutes = require("../routes/bookingRoutes");
const airportRoutes = require("../routes/airportRoutes");
const quoteRoutes = require("../routes/quoteRoutes");
const contactRoutes = require("../routes/contactRoutes");
const aircraftRoutes = require("../routes/aircraftRoutes");
const productRoutes = require("../routes/productRoutes");
const orderRoutes = require("../routes/orderRoutes");

// Authentication middleware (stub)
function authenticate(req, res, next) {
  // TODO: Implement real authentication logic
  next();
}

const router = express.Router();

// Mount routes
router.use("/api/users", userRoutes);
router.use("/api/bookings", bookingRoutes);
router.use("/api/airports", airportRoutes);
router.use("/api/quotes", quoteRoutes);
router.use("/api/contacts", contactRoutes);
router.use("/api/aircraft", aircraftRoutes);

// Protected routes
router.use("/api/products", authenticate, productRoutes);
router.use("/api/orders", authenticate, orderRoutes);

// Health check
router.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok", time: new Date() });
});

// API 404 handler
router.use("/api/*", (req, res) => {
  res.status(404).json({ error: "API route not found" });
});

module.exports = router;


