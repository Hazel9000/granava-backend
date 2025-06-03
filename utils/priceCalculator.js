// Calculate flight price based on aircraft and route
export const calculateFlightPrice = (aircraft, departure, destination, returnDate) => {
  // Simple distance estimation based on airport codes
  // In a real application, you would use a distance API or database
  const distance = estimateDistance(departure, destination)

  // Calculate flight time based on aircraft speed
  const speedValue = aircraft.speed.includes("Mach")
    ? 1000 // Approximate conversion from Mach to km/h for calculation
    : Number.parseInt(aircraft.speed) || 800

  const flightHours = Math.max(1, distance / speedValue)

  // Calculate base price
  const basePrice = Math.round(aircraft.price * flightHours)

  // Calculate fees (15% of base price)
  const fees = Math.round(basePrice * 0.15)

  // Calculate taxes (10% of base price)
  const taxes = Math.round(basePrice * 0.1)

  // Calculate total
  let total = basePrice + fees + taxes

  // Add return flight if applicable (10% discount on return)
  if (returnDate) {
    total = Math.round(total * 1.8) // 10% discount on return flight
  }

  return {
    basePrice,
    fees,
    taxes,
    total,
  }
}

// Estimate distance between airports
// This is a simplified version - in a real app, you would use a proper distance API
const estimateDistance = (departure, destination) => {
  // Map of airport codes to coordinates (lat, lng)
  const airportCoordinates = {
    JKIA: [-1.3192, 36.9252], // Nairobi
    DXB: [25.2532, 55.3644], // Dubai
    JNB: [-26.1392, 28.2496], // Johannesburg
    LHR: [51.47, -0.4543], // London
    CPT: [-33.9649, 18.6021], // Cape Town
  }

  // Extract airport codes from strings if they contain them
  const extractCode = (str) => {
    const codes = Object.keys(airportCoordinates)
    for (const code of codes) {
      if (str.includes(code)) return code
    }
    return null
  }

  const depCode = extractCode(departure)
  const destCode = extractCode(destination)

  // If we have coordinates for both airports, calculate distance
  if (depCode && destCode) {
    return calculateHaversineDistance(
      airportCoordinates[depCode][0],
      airportCoordinates[depCode][1],
      airportCoordinates[destCode][0],
      airportCoordinates[destCode][1],
    )
  }

  // Default distances based on common routes
  if (departure.includes("Nairobi") && destination.includes("Dubai")) return 3500
  if (departure.includes("Dubai") && destination.includes("London")) return 5500
  if (departure.includes("Nairobi") && destination.includes("Johannesburg")) return 3000

  // Default distance if we can't determine
  return 2000
}

// Haversine formula to calculate distance between two points
const calculateHaversineDistance = (lat1, lon1, lat2, lon2) => {
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
