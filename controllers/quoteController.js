import Quote from "../models/Quote.js"
import Aircraft from "../models/Aircraft.js"
import { createError } from "../utils/errorHandler.js"
import { calculateFlightPrice } from "../utils/priceCalculator.js"

// @desc    Calculate quote
// @route   POST /api/quotes/calculate
// @access  Public
export const calculateQuote = async (req, res, next) => {
  try {
    const { departure, destination, departureDate, returnDate, aircraftType, passengers, cargo } = req.body

    // Get aircraft of the specified type
    const aircraft = await Aircraft.find({ type: aircraftType })

    if (aircraft.length === 0) {
      return next(createError(404, "No aircraft found for the specified type"))
    }

    // Find the most suitable aircraft based on passenger count
    let selectedAircraft
    if (aircraftType === "cargo") {
      // For cargo, select based on payload capacity
      selectedAircraft = aircraft.reduce((prev, curr) => {
        const prevPayload = Number.parseInt(prev.payload) || 0
        const currPayload = Number.parseInt(curr.payload) || 0
        return cargo <= currPayload && (cargo > prevPayload || currPayload < prevPayload) ? curr : prev
      }, aircraft[0])
    } else {
      // For passenger aircraft, select based on capacity
      selectedAircraft = aircraft.reduce((prev, curr) => {
        return passengers <= curr.capacity && (passengers > prev.capacity || curr.capacity < prev.capacity)
          ? curr
          : prev
      }, aircraft[0])
    }

    // Calculate price
    const { basePrice, fees, total } = calculateFlightPrice(selectedAircraft, departure, destination, returnDate)

    res.status(200).json({
      success: true,
      data: {
        route: `${departure} to ${destination}`,
        aircraft: selectedAircraft.name,
        aircraftType,
        passengers,
        cargo,
        estimatedPrice: {
          baseFee: basePrice,
          handlingFees: fees,
          total,
        },
      },
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Save quote
// @route   POST /api/quotes
// @access  Private
export const saveQuote = async (req, res, next) => {
  try {
    const {
      departure,
      destination,
      departureDate,
      returnDate,
      aircraftType,
      passengers,
      cargo,
      specialRequests,
      estimatedPrice,
    } = req.body

    const quote = await Quote.create({
      userId: req.user.id,
      departure,
      destination,
      departureDate: new Date(departureDate),
      returnDate: returnDate ? new Date(returnDate) : null,
      aircraftType,
      passengers,
      cargo,
      specialRequests,
      estimatedPrice,
    })

    res.status(201).json({
      success: true,
      data: quote,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user quotes
// @route   GET /api/quotes/user
// @access  Private
export const getUserQuotes = async (req, res, next) => {
  try {
    const quotes = await Quote.find({ userId: req.user.id }).sort("-createdAt")

    res.status(200).json({
      success: true,
      count: quotes.length,
      data: quotes,
    })
  } catch (error) {
    next(error)
  }
}
