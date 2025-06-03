import Contact from "../models/Contact.js"
import { createError } from "../utils/errorHandler.js"

// @desc    Submit contact form
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, phone, company, subject, message } = req.body

    // Create contact entry
    const contact = await Contact.create({
      name,
      email,
      phone,
      company,
      subject,
      message,
    })

    res.status(201).json({
      success: true,
      message: "Contact form submitted successfully",
      data: contact,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Get all contacts
// @route   GET /api/contact
// @access  Private/Admin
export const getAllContacts = async (req, res, next) => {
  try {
    const contacts = await Contact.find().sort("-createdAt")

    res.status(200).json({
      success: true,
      count: contacts.length,
      data: contacts,
    })
  } catch (error) {
    next(error)
  }
}

// @desc    Update contact status
// @route   PUT /api/contact/:id/status
// @access  Private/Admin
export const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body

    // Validate status
    if (!["new", "in-progress", "resolved"].includes(status)) {
      return next(createError(400, "Invalid status"))
    }

    const contact = await Contact.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true })

    if (!contact) {
      return next(createError(404, "Contact not found"))
    }

    res.status(200).json({
      success: true,
      data: contact,
    })
  } catch (error) {
    next(error)
  }
}
