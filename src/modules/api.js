// takes location and returns weather data for that location
async function getJson(location, unit) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=M6CKQHBJXEU36CWG263963LNU&in&unitGroup=${unit}`,
      { mode: "cors" }
    )
    const json = await response.json()
    return json
  } catch (err) {
    console.log("Error fetching data:", err)
  }
}

// processes JSON data from API and returns object with only required data
export async function processJson(location, unit) {
  const json = await getJson(location, unit)

  if (json) {
    const city = json.resolvedAddress
    const currentConditions = json.currentConditions
    const forecast = json.days

    const processedData = {
      location: city,
      currentTemp: currentConditions.temp,
      currentDescription: currentConditions.conditions,
      currentMax: forecast[0].tempmax,
      currentMin: forecast[0].tempmin,
      forecast: forecast
    }

    return processedData
  } else {
    console.log("No JSON data received.")
    return null
  }
}
