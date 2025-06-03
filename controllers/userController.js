import User from "../models/User.js"
import { createError } from "../utils/errorHandler.js"

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone, company } = req.body

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return next(createError(400, "Email already registered"))
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      phone,
      company,
      joinDate: new Date().toISOString(),
    })

    // Generate token
    const token = user.generateToken()

    res.status(201).json({
      success: true,
      token,
      user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // Check if email and password are provided
    if (!email || !password) {
      return next(createError(400, "Please provide email and password"))
    }

    // Check if user exists
    const user = await User.findOne({ email }).select("+password")
    if (!user) {
      return next(createError(401, "Invalid email or password"))
    }

    // Check if password is correct
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return next(createError(401, "Invalid email or password"))
    }

    // Generate token
    const token = user.generateToken()

    res.status(200).json({
      success: true,
      token,
      user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)

    if (!user) {
      return next(createError(404, "User not found"))
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const { name, phone, company } = req.body

    const user = await User.findByIdAndUpdate(req.user.id, { name, phone, company }, { new: true, runValidators: true })

    if (!user) {
      return next(createError(404, "User not found"))
    }

    res.status(200).json({
      success: true,
      user,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Change user password
// @route   PUT /api/users/change-password
// @access  Private
export const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body

    // Check if passwords are provided
    if (!currentPassword || !newPassword) {
      return next(createError(400, "Please provide current and new password"))
    }

    // Get user with password
    const user = await User.findById(req.user.id).select("+password")

    // Check if current password is correct
    const isMatch = await user.comparePassword(currentPassword)
    if (!isMatch) {
      return next(createError(401, "Current password is incorrect"))
    }

    // Update password
    user.password = newPassword
    await user.save()

    res.status(200).json({
      success: true,
      message: "Password updated successfully",
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
export const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    })
  } catch (error) {
    next(error)
  }
}
