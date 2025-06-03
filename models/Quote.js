import mongoose from "mongoose"

const quoteSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    departure: {
      type: String,
      required: [true, "Departure airport is required"],
    },
    destination: {
      type: String,
      required: [true, "Destination airport is required"],
    },
    departureDate: {
      type: Date,
      required: [true, "Departure date is required"],
    },
    returnDate: {
      type: Date,
    },
    aircraftType: {
      type: String,
      enum: ["vip", "cargo", "helicopter"],
      required: [true, "Aircraft type is required"],
    },
    passengers: {
      type: Number,
      default: 1,
    },
    cargo: {
      type: Number,
      default: 0,
    },
    specialRequests: {
      type: String,
      default: "",
    },
    estimatedPrice: {
      baseFee: {
        type: Number,
        required: true,
      },
      handlingFees: {
        type: Number,
        required: true,
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

const Quote = mongoose.model("Quote", quoteSchema)

export default Quote
