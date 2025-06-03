import Aircraft from "../models/Aircraft.js"
import User from "../models/User.js"
import Booking from "../models/Booking.js"

export const seedDatabase = async () => {
  try {
    // Check if data already exists
    const aircraftCount = await Aircraft.countDocuments()
    const userCount = await User.countDocuments()

    if (aircraftCount > 0 && userCount > 0) {
      console.log("Database already seeded")
      return
    }

    // Seed aircraft data
    if (aircraftCount === 0) {
      const aircraft = [
        {
          name: "Gulfstream G650ER",
          type: "vip",
          capacity: 14,
          range: "7,500 nm",
          speed: "Mach 0.925",
          price: 8200,
          image:
            "https://images.unsplash.com/photo-1556388158-158ea5ccacbd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          features: ["Full stand-up cabin", "WiFi & satellite", "Conference room", "Private suites"],
        },
        {
          name: "Bombardier Global 7500",
          type: "vip",
          capacity: 19,
          range: "7,700 nm",
          speed: "Mach 0.925",
          price: 9500,
          image:
            "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          features: ["Four living spaces", "Full kitchen", "Queen-size bed", "Ultra-long range"],
        },
        {
          name: "Boeing 737-800BCF",
          type: "cargo",
          capacity: 0,
          range: "3,750 km",
          speed: "850 km/h",
          price: 15000,
          image:
            "https://images.unsplash.com/photo-1581093450021-3a5e10df8a9e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          features: ["Main deck cargo door", "Temperature control", "Quick turnaround", "Global availability"],
          payload: "23,900 kg",
          volume: "141 m³",
        },
        {
          name: "Sikorsky S-92 VIP",
          type: "helicopter",
          capacity: 12,
          range: "1,100 km",
          speed: "306 km/h",
          price: 4500,
          image:
            "https://images.unsplash.com/photo-1578973615934-8d9cdb0c0c67?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
          features: ["Executive interior", "Low noise levels", "Short takeoff/landing", "Offshore certified"],
        },
      ]

      await Aircraft.insertMany(aircraft)
      console.log("Aircraft data seeded")
    }

    // Seed user data
    if (userCount === 0) {
      const users = [
        {
          name: "Demo User",
          email: "demo@globaljet.com",
          password: "demo123",
          phone: "+254700000000",
          company: "Demo Corp",
          role: "user",
          joinDate: "2023-01-01",
        },
        {
          name: "Admin User",
          email: "admin@globaljetsolutions.com",
          password: "admin123",
          phone: "+254722000000",
          company: "GlobalJet Solutions",
          role: "admin",
          joinDate: "2023-01-01",
        },
      ]

      const createdUsers = await User.create(users)
      console.log("User data seeded")

      // Seed booking data
      const demoUser = createdUsers.find((user) => user.email === "demo@globaljet.com")
      const aircraft = await Aircraft.find()

      if (demoUser && aircraft.length > 0) {
        const bookings = [
          {
            bookingId: "GB-123456",
            userId: demoUser._id,
            aircraftId: aircraft[0]._id,
            aircraft: aircraft[0].name,
            departure: "Nairobi (JKIA)",
            destination: "Dubai International",
            passengers: 8,
            cargo: 0,
            date: new Date("2024-06-15"),
            status: "confirmed",
            price: {
              basePrice: 32800,
              fees: 4920,
              taxes: 3280,
              total: 41000,
            },
            createdAt: new Date("2024-05-10"),
          },
          {
            bookingId: "GB-789012",
            userId: demoUser._id,
            aircraftId: aircraft[1]._id,
            aircraft: aircraft[1].name,
            departure: "Dubai International",
            destination: "London Luton",
            passengers: 12,
            cargo: 0,
            date: new Date("2024-07-22"),
            status: "pending",
            price: {
              basePrice: 47500,
              fees: 7125,
              taxes: 4750,
              total: 59375,
            },
            createdAt: new Date("2024-05-18"),
          },
        ]

        await Booking.insertMany(bookings)
        console.log("Booking data seeded")
      }
    }

    console.log("Database seeding completed")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}
