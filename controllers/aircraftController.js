import Aircraft from "../models/Aircraft.js"
import { createError } from "../utils/errorHandler.js"

// @desc    Get all aircraft
// @route   GET /api/aircraft
// @access  Public
export const getAllAircraft = async (req, res, next) => {
  try {
    const aircraft = await Aircraft.find()

    res.status(200).json({
      success: true,
      count: aircraft.length,
      data: aircraft,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get aircraft by ID
// @route   GET /api/aircraft/:id
// @access  Public
export const getAircraftById = async (req, res, next) => {
  try {
    const aircraft = await Aircraft.findById(req.params.id)

    if (!aircraft) {
      return next(createError(404, "Aircraft not found"))
    }

    res.status(200).json({
      success: true,
      data: aircraft,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get aircraft by type
// @route   GET /api/aircraft/type/:type
// @access  Public
export const getAircraftByType = async (req, res, next) => {
  try {
    const { type } = req.params

    // Validate type
    if (!["vip", "cargo", "helicopter"].includes(type)) {
      return next(createError(400, "Invalid aircraft type"))
    }

    const aircraft = await Aircraft.find({ type })

    res.status(200).json({
      success: true,
      count: aircraft.length,
      data: aircraft,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Create new aircraft
// @route   POST /api/aircraft
// @access  Private/Admin
export const createAircraft = async (req, res, next) => {
  try {
    const aircraft = await Aircraft.create(req.body)

    res.status(201).json({
      success: true,
      data: aircraft,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update aircraft
// @route   PUT /api/aircraft/:id
// @access  Private/Admin
export const updateAircraft = async (req, res, next) => {
  try {
    const aircraft = await Aircraft.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })

    if (!aircraft) {
      return next(createError(404, "Aircraft not found"))
    }

    res.status(200).json({
      success: true,
      data: aircraft,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Delete aircraft
// @route   DELETE /api/aircraft/:id
// @access  Private/Admin
export const deleteAircraft = async (req, res, next) => {
  try {
    const aircraft = await Aircraft.findByIdAndDelete(req.params.id)

    if (!aircraft) {
      return next(createError(404, "Aircraft not found"))
    }

    res.status(200).json({
      success: true,
      message: "Aircraft deleted successfully",
    })
  } catch (error) {
    next(error)
  }
}
