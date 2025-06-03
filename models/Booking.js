import mongoose from "mongoose"

const bookingSchema = new mongoose.Schema(
  {
    bookingId: {
      type: String,
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    departure: {
      type: String,
      required: [true, "Departure airport is required"],
    },
    destination: {
      type: String,
      required: [true, "Destination airport is required"],
    },
    aircraft: {
      type: String,
      required: [true, "Aircraft name is required"],
    },
    aircraftId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Aircraft",
    },
    passengers: {
      type: Number,
      default: 1,
      min: [1, "At least one passenger is required"],
    },
    cargo: {
      type: Number,
      default: 0,
    },
    date: {
      type: Date,
      required: [true, "Departure date is required"],
    },
    returnDate: {
      type: Date,
    },
    specialRequests: {
      type: String,
      default: "",
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "completed"],
      default: "pending",
    },
    price: {
      basePrice: {
        type: Number,
        required: true,
      },
      fees: {
        type: Number,
        default: 0,
      },
      taxes: {
        type: Number,
        default: 0,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
)

// Generate booking ID before saving
bookingSchema.pre("save", function (next) {
  if (this.bookingId) return next()

  const prefix = "GB-"
  const randomNum = Math.floor(100000 + Math.random() * 900000)
  this.bookingId = `${prefix}${randomNum}`
  next()
})

const Booking = mongoose.model("Booking", bookingSchema)

export default Booking
