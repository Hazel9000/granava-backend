import express from "express"
import {
  searchAirports,
  getPopularAirports,
  getAirportById,
  getNearbyAirports,
} from "../controllers/airportController.js"

const router = express.Router()

// Public routes
router.get("/search", searchAirports)
router.get("/popular", getPopularAirports)
router.get("/nearby", getNearbyAirports)
router.get("/:id", getAirportById)

export default router
