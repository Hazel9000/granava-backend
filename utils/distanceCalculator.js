import axios from "axios"
import Airport from "../models/Airport.js"

// Calculate distance between two airports
export const calculateDistance = async (departureCode, destinationCode) => {
  try {
    // Try to find airports in database
    const departureAirport = await Airport.findOne({
      $or: [
        { code: departureCode },
        { name: { $regex: departureCode, $options: "i" } },
        { city: { $regex: departureCode, $options: "i" } },
      ],
    })

    const destinationAirport = await Airport.findOne({
      $or: [
        { code: destinationCode },
        { name: { $regex: destinationCode, $options: "i" } },
        { city: { $regex: destinationCode, $options: "i" } },
      ],
    })

    // If both airports found in database, calculate distance using coordinates
    if (departureAirport && destinationAirport) {
      const [depLng, depLat] = departureAirport.location.coordinates
      const [destLng, destLat] = destinationAirport.location.coordinates

      return haversineDistance(depLat, depLng, destLat, destLng)
    }

    // If airports not found, use external API
    const response = await axios.get(
      `https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${encodeURIComponent(departureCode)}&destinations=${encodeURIComponent(destinationCode)}&key=${process.env.DISTANCE_API_KEY}`,
    )

    if (response.data.status === "OK") {
      return response.data.rows[0].elements[0].distance.value / 1000 // Convert meters to kilometers
    }

    // Fallback to approximate distance
    return 1000 // Default 1000 km if can't calculate
  } catch (error) {
    console.error("Error calculating distance:", error)
    return 1000 // Default 1000 km if error
  }
}

// Haversine formula to calculate distance between two points
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371 // Earth's radius in km
  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  const distance = R * c

  return distance
}

const toRad = (value) => {
  return (value * Math.PI) / 180
}
