import { icons } from "./icons"

const contentContainer = document.getElementById("content")

// display current conditions (location, conditions, temp) + forecast[0] (tempmax, tempmin)
export function displayCurrent(data) {
  const currentContainer = document.createElement("div")
  currentContainer.id = "current"

  // location
  const location = document.createElement("h3")
  location.textContent = data.location
  currentContainer.appendChild(location)

  // temp
  const temp = document.createElement("h2")
  temp.textContent = `${data.currentTemp}°`
  currentContainer.appendChild(temp)

  // condition
  const condition = document.createElement("p")
  condition.textContent = data.currentDescription
  currentContainer.appendChild(condition)

  // high and low
  const tempRange = document.createElement("div")
  const tempMax = document.createElement("span")
  tempMax.textContent = `H: ${data.currentMax}°`
  const tempMin = document.createElement("span")
  tempMin.textContent = `L: ${data.currentMin}°`
  tempMin.style.paddingLeft = "10px"
  tempRange.appendChild(tempMax)
  tempRange.appendChild(tempMin)
  currentContainer.appendChild(tempRange)

  contentContainer.appendChild(currentContainer)
}

// display today's description and hourly temp with icon
export function displayToday(data) {
  const detailsContainer = document.createElement("div")
  detailsContainer.id = "details"

  // today's description
  const todayDescription = document.createElement("div")
  todayDescription.id = "todaysDescription"
  todayDescription.textContent = data.forecast[0].description
  detailsContainer.appendChild(todayDescription)

  // hourly weather
  const todayContainer = document.createElement("div")
  todayContainer.id = "todayContainer"
  const hourlyWeather = data.forecast[0].hours

  for (let i = 0; i < hourlyWeather.length; i++) {
    const hourDiv = document.createElement("div")
    hourDiv.className = "hourDiv"
    hourDiv.id = `hourDiv${i}`

    let displayTime

    // convert to 12 hour format
    if (i === 0) {
      displayTime = "12AM"
    } else if (i < 12) {
      displayTime = `${i}AM`
    } else if (i === 12) {
      displayTime = "12 PM"
    } else {
      displayTime = `${i - 12}PM`
    }

    const time = document.createElement("p")
    time.id = "time"
    time.textContent = displayTime
    hourDiv.appendChild(time)

    const icon = document.createElement("img")
    icon.id = "iconImg"
    icon.src = replaceIcon(hourlyWeather[i].icon)
    icon.height = 12
    hourDiv.appendChild(icon)

    const temp = document.createElement("p")
    temp.textContent = `${hourlyWeather[i].temp}°`
    hourDiv.appendChild(temp)

    todayContainer.appendChild(hourDiv)
  }

  detailsContainer.appendChild(todayContainer)
  contentContainer.appendChild(detailsContainer)
}

// replace weather icon text with corresponding svg
function replaceIcon(iconName) {
  for (const icon in icons) {
    if (`${iconName}.svg` === icon) {
      return icons[icon]
    }
  }
}

// display forecast (day of the week, icon, tempmin/tempmax, preciptype, precipprob, windspeed)
export function displayForecast(data) {
  const forecastContainer = document.createElement("div")
  forecastContainer.id = "details"

  for (let i = 0; i < data.forecast.length; i++) {
    const dayContainer = document.createElement("div")
    dayContainer.className = "dayContainer"

    // day of the week and date
    const day = document.createElement("p")
    day.id = "day"
    day.textContent = determineDoW(data.forecast[i].datetime)
    dayContainer.appendChild(day)

    forecastContainer.appendChild(dayContainer)

    // // hourly weather
    // const todayContainer = document.createElement("div")
    // todayContainer.id = "todayContainer"
    // const hourlyWeather = data.forecast[0].hours

    // for (let i = 0; i < hourlyWeather.length; i++) {
    //   const hourDiv = document.createElement("div")
    //   hourDiv.className = "hourDiv"
    //   hourDiv.id = `hourDiv${i}`

    //   let displayTime

    //   // convert to 12 hour format
    //   if (i === 0) {
    //     displayTime = "12AM"
    //   } else if (i < 12) {
    //     displayTime = `${i}AM`
    //   } else if (i === 12) {
    //     displayTime = "12 PM"
    //   } else {
    //     displayTime = `${i - 12}PM`
    //   }

    //   const time = document.createElement("p")
    //   time.id = "time"
    //   time.textContent = displayTime
    //   hourDiv.appendChild(time)

    //   const icon = document.createElement("img")
    //   icon.id = "iconImg"
    //   icon.src = replaceIcon(hourlyWeather[i].icon)
    //   icon.height = 12
    //   hourDiv.appendChild(icon)

    //   const temp = document.createElement("p")
    //   temp.textContent = `${hourlyWeather[i].temp}°`
    //   hourDiv.appendChild(temp)

    //   todayContainer.appendChild(hourDiv)
    // }
  }

  contentContainer.appendChild(forecastContainer)
}

function determineDoW(datetime) {
  // splits string whenever it finds -, T, or :
  const parts = datetime.split(/[-T:]/)

  const year = parseInt(parts[0])
  const monthJS = parseInt(parts[1]) - 1 // months are 0-indexed in JS
  const day = parseInt(parts[2])

  // create date in local timezone (not UTC)
  const date = new Date(year, monthJS, day)

  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  return days[date.getDay()]
}
