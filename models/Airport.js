import mongoose from "mongoose"

const airportSchema = new mongoose.Schema(
  {
    code: {
      type: String,
      required: [true, "Airport code is required"],
      unique: true,
      uppercase: true,
      trim: true,
    },
    name: {
      type: String,
      required: [true, "Airport name is required"],
      trim: true,
    },
    city: {
      type: String,
      required: [true, "City is required"],
      trim: true,
    },
    country: {
      type: String,
      required: [true, "Country is required"],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    timezone: {
      type: String,
      default: "UTC",
    },
    popular: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
)

// Create geospatial index for location-based queries
airportSchema.index({ location: "2dsphere" })

const Airport = mongoose.model("Airport", airportSchema)

export default Airport
