import express from "express"
import { calculateQuote, saveQuote, getUserQuotes } from "../controllers/quoteController.js"
import { protect } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.post("/calculate", calculateQuote)

// Protected routes
router.post("/", protect, saveQuote)
router.get("/user", protect, getUserQuotes)

export default router
