import express from "express"
import {
  register,
  login,
  getProfile,
  updateProfile,
  changePassword,
  getAllUsers,
} from "../controllers/userController.js"
import { protect, restrictTo } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.post("/register", register)
router.post("/login", login)

// Protected routes
router.get("/profile", protect, getProfile)
router.put("/profile", protect, updateProfile)
router.put("/change-password", protect, changePassword)

// Admin routes
router.get("/", protect, restrictTo("admin"), getAllUsers)

export default router
