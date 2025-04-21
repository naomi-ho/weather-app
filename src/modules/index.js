import "../style.css"
import { displayCurrent, displayToday, displayForecast } from "./dom"
import { processJson } from "./api"

const form = document.getElementById("locationForm")
const locationInput = document.getElementById("location")
const contentContainer = document.getElementById("content")
const toggle = document.getElementById("toggle")
const errorDisplay = document.createElement("div")

// initialise with default values
let currentUnit = "us"
let currentLocation = "New York" // Default location

// load weather data function
async function loadWeatherData(location, unit) {
  try {
    const data = await processJson(location, unit)

    // clear any previous errors
    errorDisplay.style.display = "none"

    contentContainer.innerHTML = ""
    displayCurrent(data, unit)
    displayToday(data, unit)
    displayForecast(data, unit)
  } catch (error) {
    contentContainer.innerHTML = `<div class="error-state">
      <p>Unable to display weather for ${location}</p>
    </div>`
  }
}

// initial load with default location
loadWeatherData(currentLocation, currentUnit)

// form submission handler
form.addEventListener("submit", async (e) => {
  e.preventDefault()

  const newLocation = locationInput.value.trim()
  if (!newLocation) {
    showError("Please enter a location")
    return
  }

  currentLocation = newLocation // Update stored location

  try {
    await loadWeatherData(currentLocation, currentUnit)
    locationInput.value = "" // Clear input on success
  } catch {
    showError("Failed to fetch weather data")
  }
})

// unit toggle handler
toggle.addEventListener("change", async () => {
  currentUnit = toggle.checked ? "metric" : "us"
  if (currentLocation) {
    try {
      await loadWeatherData(currentLocation, currentUnit)
    } catch {
      showError("Failed to update units")
    }
  } else {
    showError("Please search for a location first")
  }
})
