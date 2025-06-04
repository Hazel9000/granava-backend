import express from "express"
import { submitContactForm, getAllContacts, updateContactStatus } from "../controllers/contactController.js"
import { protect, restrictTo } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.post("/", submitContactForm)

// Admin routes
router.get("/", protect, restrictTo("admin"), getAllContacts)
router.put("/:id/status", protect, restrictTo("admin"), updateContactStatus)

export default router
