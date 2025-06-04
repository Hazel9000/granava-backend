import express from "express"
import {
  createBooking,
  getUserBookings,
  getBookingById,
  updateBookingStatus,
  cancelBooking,
  getAllBookings,
} from "../controllers/bookingController.js"
import { protect, restrictTo } from "../middleware/authMiddleware.js"

const router = express.Router()

// User routes
router.post("/", protect, createBooking)
router.get("/user", protect, getUserBookings)
router.get("/:id", protect, getBookingById)
router.put("/:id/cancel", protect, cancelBooking)

// Admin routes
router.get("/", protect, restrictTo("admin"), getAllBookings)
router.put("/:id/status", protect, restrictTo("admin"), updateBookingStatus)

export default router
