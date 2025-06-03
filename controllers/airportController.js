import Airport from "../models/Airport.js"
import { createError } from "../utils/errorHandler.js"

// @desc    Search airports
// @route   GET /api/airports/search
// @access  Public
export const searchAirports = async (req, res, next) => {
  try {
    const { query } = req.query

    if (!query) {
      return next(createError(400, "Search query is required"))
    }

    const airports = await Airport.find({
      $or: [
        { code: { $regex: query, $options: "i" } },
        { name: { $regex: query, $options: "i" } },
        { city: { $regex: query, $options: "i" } },
        { country: { $regex: query, $options: "i" } },
      ],
    }).limit(10)

    res.status(200).json({
      success: true,
      count: airports.length,
      data: airports,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get popular airports
// @route   GET /api/airports/popular
// @access  Public
export const getPopularAirports = async (req, res, next) => {
  try {
    const airports = await Airport.find({ popular: true }).limit(20)

    res.status(200).json({
      success: true,
      count: airports.length,
      data: airports,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get airport by ID
// @route   GET /api/airports/:id
// @access  Public
export const getAirportById = async (req, res, next) => {
  try {
    const airport = await Airport.findById(req.params.id)

    if (!airport) {
      return next(createError(404, "Airport not found"))
    }

    res.status(200).json({
      success: true,
      data: airport,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get nearby airports
// @route   GET /api/airports/nearby
// @access  Public
export const getNearbyAirports = async (req, res, next) => {
  try {
    const { lat, lng, distance = 100 } = req.query

    if (!lat || !lng) {
      return next(createError(400, "Latitude and longitude are required"))
    }

    // Convert distance from km to meters
    const radius = distance * 1000

    const airports = await Airport.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [Number.parseFloat(lng), Number.parseFloat(lat)],
          },
          $maxDistance: radius,
        },
      },
    }).limit(10)

    res.status(200).json({
      success: true,
      count: airports.length,
      data: airports,
    })
  } catch (error) {
    next(error)
  }
}
