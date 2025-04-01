import "../style.css"
import { displayCurrent, displayToday } from "./dom"
import { processJson } from "./api"

const form = document.getElementById("locationForm")
const locationInput = document.getElementById("location")
const contentContainer = document.getElementById("content")

// event listener for form submit button to fetch weather info
form.addEventListener("submit", async (e) => {
  e.preventDefault()
  const data = await processJson(locationInput.value) // stores processed API result
  contentContainer.innerHTML = ""
  displayCurrent(data)
  displayToday(data)

  // clears search bar after submission
  locationInput.value = ""
})
