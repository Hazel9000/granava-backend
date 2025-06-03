import mongoose from "mongoose"

const aircraftSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Aircraft name is required"],
      trim: true,
    },
    type: {
      type: String,
      required: [true, "Aircraft type is required"],
      enum: ["vip", "cargo", "helicopter"],
      lowercase: true,
    },
    capacity: {
      type: Number,
      default: 0,
    },
    range: {
      type: String,
      required: [true, "Aircraft range is required"],
    },
    speed: {
      type: String,
      required: [true, "Aircraft speed is required"],
    },
    price: {
      type: Number,
      required: [true, "Hourly price is required"],
    },
    image: {
      type: String,
      required: [true, "Aircraft image is required"],
    },
    features: {
      type: [String],
      default: [],
    },
    // Additional fields for cargo aircraft
    payload: {
      type: String,
      default: "",
    },
    volume: {
      type: String,
      default: "",
    },
    // Availability status
    available: {
      type: Boolean,
      default: true,
    },
    // Base location
    baseLocation: {
      type: String,
      default: "Nairobi, Kenya",
    },
  },
  { timestamps: true },
)

const Aircraft = mongoose.model("Aircraft", aircraftSchema)

export default Aircraft
