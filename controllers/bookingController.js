import Booking from "../models/Booking.js"
import User from "../models/User.js"
import Aircraft from "../models/Aircraft.js"
import { createError } from "../utils/errorHandler.js"
import { calculateFlightPrice } from "../utils/priceCalculator.js"

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
export const createBooking = async (req, res, next) => {
  try {
    const { aircraftId, departure, destination, date, returnDate, passengers, cargo, specialRequests } = req.body

    // Check if aircraft exists
    const aircraft = await Aircraft.findById(aircraftId)
    if (!aircraft) {
      return next(createError(404, "Aircraft not found"))
    }

    // Calculate price
    const { basePrice, fees, taxes, total } = calculateFlightPrice(aircraft, departure, destination, returnDate)

    // Create booking
    const booking = await Booking.create({
      userId: req.user.id,
      aircraftId,
      aircraft: aircraft.name,
      departure,
      destination,
      date: new Date(date),
      returnDate: returnDate ? new Date(returnDate) : null,
      passengers,
      cargo,
      specialRequests,
      price: {
        basePrice,
        fees,
        taxes,
        total,
      },
      status: "pending",
    })

    // Add loyalty points to user (100 points per booking)
    await User.findByIdAndUpdate(req.user.id, {
      $inc: { loyaltyPoints: 100 },
    })

    res.status(201).json({
      success: true,
      data: booking,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user bookings
// @route   GET /api/bookings/user
// @access  Private
export const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id }).sort("-createdAt")

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get booking by ID
// @route   GET /api/bookings/:id
// @access  Private
export const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return next(createError(404, "Booking not found"))
    }

    // Check if booking belongs to user or user is admin
    if (booking.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to access this booking"))
    }

    res.status(200).json({
      success: true,
      data: booking,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update booking status
// @route   PUT /api/bookings/:id/status
// @access  Private/Admin
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body

    // Validate status
    if (!["pending", "confirmed", "cancelled", "completed"].includes(status)) {
      return next(createError(400, "Invalid status"))
    }

    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true })

    if (!booking) {
      return next(createError(404, "Booking not found"))
    }

    res.status(200).json({
      success: true,
      data: booking,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
export const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)

    if (!booking) {
      return next(createError(404, "Booking not found"))
    }

    // Check if booking belongs to user
    if (booking.userId.toString() !== req.user.id && req.user.role !== "admin") {
      return next(createError(403, "Not authorized to cancel this booking"))
    }

    // Check if booking can be cancelled
    if (booking.status === "completed") {
      return next(createError(400, "Cannot cancel a completed booking"))
    }

    // Update booking status
    booking.status = "cancelled"
    await booking.save()

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      data: booking,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private/Admin
export const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find().sort("-createdAt")

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    })
  } catch (error) {
    next(error)
  }
}
