// This file contains examples of how to integrate the backend with your frontend

// API Base URL - replace with your actual backend URL when deployed
const API_BASE_URL = "http://localhost:5000/api"

// Helper function for making API requests
async function apiRequest(endpoint, method = "GET", data = null, token = null) {
  const headers = {
    "Content-Type": "application/json",
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const config = {
    method,
    headers,
  }

  if (data && (method === "POST" || method === "PUT")) {
    config.body = JSON.stringify(data)
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, config)
  const result = await response.json()

  if (!response.ok) {
    throw new Error(result.message || "Something went wrong")
  }

  return result
}

// 1. Authentication
// Login
async function loginUser(email, password) {
  const result = await apiRequest("/users/login", "POST", { email, password })

  if (result.success) {
    // Store token and user in localStorage
    localStorage.setItem("token", result.token)
    localStorage.setItem("currentUser", JSON.stringify(result.user))
  }

  return result
}

// Register
async function registerUser(userData) {
  const result = await apiRequest("/users/register", "POST", userData)

  if (result.success) {
    // Store token and user in localStorage
    localStorage.setItem("token", result.token)
    localStorage.setItem("currentUser", JSON.stringify(result.user))
  }

  return result
}

// Get user profile
async function getUserProfile() {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Authentication required")

  return await apiRequest("/users/profile", "GET", null, token)
}

// Update user profile
async function updateUserProfile(userData) {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Authentication required")

  return await apiRequest("/users/profile", "PUT", userData, token)
}

// 2. Aircraft Fleet
// Get all aircraft
async function getAllAircraft() {
  return await apiRequest("/aircraft")
}

// Get aircraft by type
async function getAircraftByType(type) {
  return await apiRequest(`/aircraft/type/${type}`)
}

// 3. Quote Calculator
// Calculate quote
async function calculateQuote(quoteData) {
  return await apiRequest("/quotes/calculate", "POST", quoteData)
}

// Save quote
async function saveQuote(quoteData) {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Authentication required")

  return await apiRequest("/quotes", "POST", quoteData, token)
}

// 4. Bookings
// Create booking
async function createBooking(bookingData) {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Authentication required")

  return await apiRequest("/bookings", "POST", bookingData, token)
}

// Get user bookings
async function getUserBookings() {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Authentication required")

  return await apiRequest("/bookings/user", "GET", null, token)
}

// Cancel booking
async function cancelBooking(bookingId) {
  const token = localStorage.getItem("token")
  if (!token) throw new Error("Authentication required")

  return await apiRequest(`/bookings/${bookingId}/cancel`, "PUT", {}, token)
}

// 5. Contact Form
// Submit contact form
async function submitContactForm(contactData) {
  return await apiRequest("/contact", "POST", contactData)
}

// 6. Helper Functions
// Check if user is logged in
function isLoggedIn() {
  return localStorage.getItem("token") !== null
}

// Get current user
function getCurrentUser() {
  const userJson = localStorage.getItem("currentUser")
  return userJson ? JSON.parse(userJson) : null
}

// Logout user
function logoutUser() {
  localStorage.removeItem("token")
  localStorage.removeItem("currentUser")
}

// Update UI based on login state
function updateUI() {
  const currentUser = getCurrentUser()

  if (currentUser) {
    // User is logged in
    document.querySelector(".auth-buttons").style.display = "none"
    if (!document.getElementById("dashboardLink")) {
      document.querySelector(".nav-links").insertAdjacentHTML(
        "beforeend",
        `
        <a href="#dashboard" id="dashboardLink">My Dashboard</a>
      `,
      )
    }
    document.getElementById("dashboard").style.display = "block"
    document.getElementById("userName").textContent = currentUser.name
    loadUserBookings()

    // Add event listener for dashboard link
    document.getElementById("dashboardLink")?.addEventListener("click", (e) => {
      e.preventDefault()
      document.querySelectorAll("section").forEach((section) => {
        section.style.display = "none"
      })
      document.getElementById("dashboard").style.display = "block"
      window.scrollTo(0, 0)
    })
  } else {
    // User is logged out
    document.querySelector(".auth-buttons").style.display = "flex"
    const dashboardLink = document.getElementById("dashboardLink")
    if (dashboardLink) dashboardLink.remove()
    document.getElementById("dashboard").style.display = "none"
    document.querySelectorAll("section").forEach((section) => {
      if (section.id !== "dashboard") {
        section.style.display = "block"
      }
    })
  }
}

// Load user bookings
async function loadUserBookings() {
  if (!isLoggedIn()) return

  try {
    const result = await getUserBookings()
    const bookings = result.data

    const tableBody = document.getElementById("bookingsTableBody")
    tableBody.innerHTML = ""

    bookings.forEach((booking) => {
      const row = document.createElement("tr")
      row.innerHTML = `
        <td>${booking.bookingId}</td>
        <td>${booking.departure} → ${booking.destination}</td>
        <td>${booking.aircraft}</td>
        <td>${new Date(booking.date).toLocaleDateString()}</td>
        <td class="status-${booking.status}">${booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</td>
        <td><a href="#" class="btn btn-outline booking-details" data-id="${booking._id}" style="padding: 5px 10px; font-size: 0.8rem;">Details</a></td>
      `
      tableBody.appendChild(row)
    })

    // Add event listeners to booking details buttons
    document.querySelectorAll(".booking-details").forEach((btn) => {
      btn.addEventListener("click", async (e) => {
        e.preventDefault()
        const bookingId = btn.dataset.id
        // Show booking details (implement as needed)
        alert(`Booking details for ${bookingId}`)
      })
    })

    document.getElementById("activeBookings").textContent = bookings.filter((b) => b.status === "confirmed").length
    document.getElementById("totalFlights").textContent = bookings.length

    const user = getCurrentUser()
    document.getElementById("loyaltyPoints").textContent = user.loyaltyPoints || 0
  } catch (error) {
    console.error("Error loading bookings:", error)
    showToast("Failed to load bookings", "error")
  }
}

// Show toast notification
function showToast(message, type = "success") {
  const toast = document.createElement("div")
  toast.className = `toast-notification ${type}`
  toast.textContent = message
  document.body.appendChild(toast)

  setTimeout(() => {
    toast.classList.add("show")
  }, 10)

  setTimeout(() => {
    toast.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(toast)
    }, 300)
  }, 3000)
}

// Initialize the application
function initApp() {
  // Check if user is logged in
  updateUI()

  // Load aircraft data
  loadAircraft()

  // Setup event listeners
  setupEventListeners()
}

// Load aircraft data
async function loadAircraft() {
  try {
    const result = await getAllAircraft()
    const aircraft = result.data

    const fleetGrid = document.querySelector(".fleet-grid")
    fleetGrid.innerHTML = ""

    aircraft.forEach((item) => {
      const card = document.createElement("div")
      card.className = "aircraft-card"
      card.dataset.type = item.type

      card.innerHTML = `
        <div class="aircraft-image">
          <img src="${item.image}" alt="${item.name}">
        </div>
        <div class="aircraft-details">
          <h3>${item.name}</h3>
          <div class="aircraft-specs">
            ${
              item.type !== "cargo"
                ? `
              <div class="spec-item">
                <i class="fas fa-users"></i>
                <span>${item.capacity} passengers</span>
              </div>
            `
                : `
              <div class="spec-item">
                <i class="fas fa-box"></i>
                <span>${item.payload} payload</span>
              </div>
            `
            }
            <div class="spec-item">
              <i class="fas fa-plane"></i>
              <span>${item.range} range</span>
            </div>
            <div class="spec-item">
              <i class="fas fa-tachometer-alt"></i>
              <span>${item.speed}</span>
            </div>
            ${
              item.type === "cargo"
                ? `
              <div class="spec-item">
                <i class="fas fa-cube"></i>
                <span>${item.volume} volume</span>
              </div>
            `
                : `
              <div class="spec-item">
                <i class="fas fa-clock"></i>
                <span>${estimateEndurance(item)} endurance</span>
              </div>
            `
            }
          </div>
          <div class="aircraft-features">
            <div class="features-title">Key Features:</div>
            <div class="features-list">
              ${item.features.map((feature) => `<span class="feature-tag">${feature}</span>`).join("")}
            </div>
          </div>
          <div class="aircraft-price">
            From $${item.price.toLocaleString()}/hour
          </div>
          <a href="#quote" class="btn btn-outline" style="width: 100%; text-align: center;">Request Booking</a>
        </div>
      `

      fleetGrid.appendChild(card)
    })

    // Setup fleet filters
    setupFleetFilters()
  } catch (error) {
    console.error("Error loading aircraft:", error)
    showToast("Failed to load aircraft data", "error")
  }
}

// Estimate aircraft endurance based on range and speed
function estimateEndurance(aircraft) {
  // Extract numeric value from speed
  const speedMatch = aircraft.speed.match(/\d+/)
  if (!speedMatch) return "N/A"

  const speed = Number.parseInt(speedMatch[0])

  // Extract numeric value from range
  const rangeMatch = aircraft.range.match(/\d+/)
  if (!rangeMatch) return "N/A"

  const range = Number.parseInt(rangeMatch[0])

  // Calculate endurance in hours
  const endurance = range / speed

  // Format endurance
  return `${Math.round(endurance)} hrs`
}

// Setup fleet filters
function setupFleetFilters() {
  const filterButtons = document.querySelectorAll(".filter-btn")
  const aircraftCards = document.querySelectorAll(".aircraft-card")

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Remove active class from all buttons
      filterButtons.forEach((btn) => btn.classList.remove("active"))

      // Add active class to clicked button
      button.classList.add("active")

      const filterValue = button.dataset.filter

      // Filter aircraft cards
      aircraftCards.forEach((card) => {
        if (filterValue === "all" || card.dataset.type === filterValue) {
          card.style.display = "block"
        } else {
          card.style.display = "none"
        }
      })
    })
  })
}

// Setup event listeners
function setupEventListeners() {
  // Login form
  document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
    e.preventDefault()
    const email = document.getElementById("loginEmail").value
    const password = document.getElementById("loginPassword").value

    try {
      await loginUser(email, password)
      document.getElementById("loginModal").style.display = "none"
      updateUI()
      showToast("Login successful!")
    } catch (error) {
      showToast(error.message || "Invalid email or password", "error")
    }
  })

  // Register form
  document.getElementById("registerForm")?.addEventListener("submit", async (e) => {
    e.preventDefault()
    const name = document.getElementById("registerName").value
    const email = document.getElementById("registerEmail").value
    const phone = document.getElementById("registerPhone").value
    const company = document.getElementById("registerCompany").value
    const password = document.getElementById("registerPassword").value
    const confirm = document.getElementById("registerConfirm").value

    if (password !== confirm) {
      showToast("Passwords do not match", "error")
      return
    }

    try {
      await registerUser({ name, email, phone, company, password })
      document.getElementById("registerModal").style.display = "none"
      updateUI()
      showToast("Registration successful!")
    } catch (error) {
      showToast(error.message || "Registration failed", "error")
    }
  })

  // Logout button
  document.getElementById("logoutBtn")?.addEventListener("click", () => {
    logoutUser()
    updateUI()
    showToast("Logged out successfully")
  })

  // Quote calculator
  setupQuoteCalculator()

  // Contact form
  document.getElementById("contactForm")?.addEventListener("submit", async (e) => {
    e.preventDefault()

    const contactData = {
      name: document.getElementById("contactName").value,
      email: document.getElementById("contactEmail").value,
      phone: document.getElementById("contactPhone").value,
      company: document.getElementById("contactCompany").value,
      subject: document.getElementById("contactSubject").value,
      message: document.getElementById("contactMessage").value,
    }

    try {
      await submitContactForm(contactData)
      document.getElementById("contactForm").reset()
      showToast("Your message has been sent. We will contact you shortly!")
    } catch (error) {
      showToast(error.message || "Failed to send message", "error")
    }
  })
}

// Setup quote calculator
function setupQuoteCalculator() {
  // Step navigation
  document.querySelectorAll(".next-step").forEach((button) => {
    button.addEventListener("click", () => {
      const currentForm = button.closest(".calculator-form")
      const currentStep = Number.parseInt(currentForm.dataset.step)
      const nextStep = currentStep + 1

      // Validate current step
      if (currentStep === 1) {
        const departure = document.getElementById("departure").value
        const destination = document.getElementById("destination").value
        const departureDate = document.getElementById("departureDate").value

        if (!departure || !destination || !departureDate) {
          showToast("Please fill in all required fields", "error")
          return
        }
      } else if (currentStep === 2) {
        const selectedAircraft = document.querySelector(".aircraft-type-option.selected")
        if (!selectedAircraft) {
          showToast("Please select an aircraft type", "error")
          return
        }
      } else if (currentStep === 3) {
        const passengers = document.getElementById("passengers").value
        if (!passengers || passengers < 1) {
          showToast("Please enter at least 1 passenger", "error")
          return
        }
      }

      // Hide current form and show next form
      document.querySelector(`.calculator-form[data-step="${currentStep}"]`).classList.remove("active")
      document.querySelector(`.calculator-form[data-step="${nextStep}"]`).classList.add("active")

      // Update steps
      document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove("active")
      document.querySelector(`.step[data-step="${currentStep}"]`).classList.add("completed")
      document.querySelector(`.step[data-step="${nextStep}"]`).classList.add("active")

      // If last step, calculate quote
      if (nextStep === 4) {
        calculateFlightQuote()
      }
    })
  })

  // Previous step buttons
  document.querySelectorAll(".prev-step").forEach((button) => {
    button.addEventListener("click", () => {
      const currentForm = button.closest(".calculator-form")
      const currentStep = Number.parseInt(currentForm.dataset.step)
      const prevStep = currentStep - 1

      // Hide current form and show previous form
      document.querySelector(`.calculator-form[data-step="${currentStep}"]`).classList.remove("active")
      document.querySelector(`.calculator-form[data-step="${prevStep}"]`).classList.add("active")

      // Update steps
      document.querySelector(`.step[data-step="${currentStep}"]`).classList.remove("active")
      document.querySelector(`.step[data-step="${prevStep}"]`).classList.remove("completed")
      document.querySelector(`.step[data-step="${prevStep}"]`).classList.add("active")
    })
  })

  // Aircraft type selection
  document.querySelectorAll(".aircraft-type-option").forEach((option) => {
    option.addEventListener("click", () => {
      document.querySelectorAll(".aircraft-type-option").forEach((opt) => {
        opt.classList.remove("selected")
      })
      option.classList.add("selected")
    })
  })

  // Book now button
  document.getElementById("bookNowBtn")?.addEventListener("click", async () => {
    if (!isLoggedIn()) {
      showToast("Please login or register to book", "error")
      document.getElementById("loginModal").style.display = "flex"
      return
    }

    const departure = document.getElementById("departure").value
    const destination = document.getElementById("destination").value
    const departureDate = document.getElementById("departureDate").value
    const returnDate = document.getElementById("returnDate").value
    const aircraftType = document.querySelector(".aircraft-type-option.selected")?.dataset.type
    const passengers = document.getElementById("passengers").value
    const cargo = document.getElementById("cargo").value
    const specialRequests = document.getElementById("specialRequests").value

    try {
      // First get aircraft based on type
      const aircraftResult = await getAircraftByType(aircraftType)
      if (!aircraftResult.data || aircraftResult.data.length === 0) {
        throw new Error("No suitable aircraft found")
      }

      const aircraft = aircraftResult.data[0]

      const bookingData = {
        aircraftId: aircraft._id,
        departure,
        destination,
        date: departureDate,
        returnDate,
        passengers: Number.parseInt(passengers),
        cargo: Number.parseInt(cargo),
        specialRequests,
      }

      const result = await createBooking(bookingData)
      showToast(`Booking request submitted (${result.data.bookingId}). Our team will contact you shortly.`)

      // Reset calculator
      document.querySelectorAll(".calculator-form").forEach((form) => {
        form.classList.remove("active")
      })
      document.querySelector('.calculator-form[data-step="1"]').classList.add("active")

      document.querySelectorAll(".step").forEach((step) => {
        step.classList.remove("active", "completed")
      })
      document.querySelector('.step[data-step="1"]').classList.add("active")

      // Load user bookings
      loadUserBookings()
    } catch (error) {
      showToast(error.message || "Failed to create booking", "error")
    }
  })
}

// Calculate flight quote
async function calculateFlightQuote() {
  const departure = document.getElementById("departure").value
  const destination = document.getElementById("destination").value
  const departureDate = document.getElementById("departureDate").value
  const returnDate = document.getElementById("returnDate").value
  const aircraftType = document.querySelector(".aircraft-type-option.selected")?.dataset.type
  const passengers = document.getElementById("passengers").value
  const cargo = document.getElementById("cargo").value

  try {
    const result = await calculateQuote({
      departure,
      destination,
      departureDate,
      returnDate,
      aircraftType,
      passengers: Number.parseInt(passengers),
      cargo: Number.parseInt(cargo),
    })

    const quote = result.data

    // Update quote display
    document.getElementById("quote-route").textContent = quote.route
    document.getElementById("quote-aircraft").textContent = quote.aircraft
    document.getElementById("quote-passengers").textContent = quote.passengers
    document.getElementById("quote-cargo").textContent = quote.cargo + " kg"
    document.getElementById("quote-base-fee").textContent = "$" + quote.estimatedPrice.baseFee.toLocaleString()
    document.getElementById("quote-handling").textContent = "$" + quote.estimatedPrice.handlingFees.toLocaleString()
    document.getElementById("quote-total").textContent = "$" + quote.estimatedPrice.total.toLocaleString()
  } catch (error) {
    console.error("Error calculating quote:", error)
    showToast("Failed to calculate quote", "error")
  }
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", initApp)
