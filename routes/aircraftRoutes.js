import express from "express"
import {
  getAllAircraft,
  getAircraftById,
  getAircraftByType,
  createAircraft,
  updateAircraft,
  deleteAircraft,
} from "../controllers/aircraftController.js"
import { protect, restrictTo } from "../middleware/authMiddleware.js"

const router = express.Router()

// Public routes
router.get("/", getAllAircraft)
router.get("/type/:type", getAircraftByType)
router.get("/:id", getAircraftById)

// Admin routes
router.post("/", protect, restrictTo("admin"), createAircraft)
router.put("/:id", protect, restrictTo("admin"), updateAircraft)
router.delete("/:id", protect, restrictTo("admin"), deleteAircraft)

export default router
