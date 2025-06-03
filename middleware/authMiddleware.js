import jwt from "jsonwebtoken"
import { createError } from "../utils/errorHandler.js"
import User from "../models/User.js"

// Protect routes
export const protect = async (req, res, next) => {
  try {
    let token

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1]
    }

    // Check if token exists
    if (!token) {
      return next(createError(401, "Not authorized to access this route"))
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret")

      // Get user from token
      req.user = await User.findById(decoded.id)

      if (!req.user) {
        return next(createError(401, "User not found"))
      }

      next()
    } catch (error) {
      return next(createError(401, "Not authorized to access this route"))
    }
  } catch (error) {
    next(error)
  }
}

// Restrict to specific roles
export const restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(createError(403, "Not authorized to perform this action"))
    }
    next()
  }
}
