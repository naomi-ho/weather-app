import { icons } from "./icons"

const contentContainer = document.getElementById("content")

// determine day of the week
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
    icon.height = 15
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
  const forecastDiv = document.createElement("div")
  forecastDiv.id = "forecast"

  const forecastDescription = document.createElement("div")
  forecastDescription.id = "forecastDescription"
  forecastDescription.textContent = "Forecast"
  forecastDiv.appendChild(forecastDescription)

  const forecastContainer = document.createElement("div")
  forecastContainer.id = "forecastCont"

  for (let i = 0; i < data.forecast.length; i++) {
    const dayContainer = document.createElement("div")
    dayContainer.className = "dayContainer"

    // day of the week
    const day = document.createElement("p")
    day.className = "day"
    if (i === 0) {
      day.textContent = "Today"
    } else {
      day.textContent = determineDoW(data.forecast[i].datetime)
    }
    dayContainer.appendChild(day)

    // icon
    const icon = document.createElement("img")
    icon.className = "iconImg"
    icon.src = replaceIcon(data.forecast[i].icon)
    icon.height = 18
    dayContainer.appendChild(icon)

    // temp
    const temp = document.createElement("p")
    temp.className = "temp"
    temp.textContent = `${Math.round(data.forecast[i].tempmin)}° / ${Math.round(data.forecast[i].tempmax)}°`
    dayContainer.appendChild(temp)

    // precipitation container
    const precipContainer = document.createElement("div")
    precipContainer.className = "precipContainer"

    // preciptype
    const precip = document.createElement("div")
    precip.className = "precip"
    if (data.forecast[i].preciptype === null) {
      const preciptype = document.createElement("img")
      preciptype.src = replaceIcon("rain")
      preciptype.height = 18
      precip.appendChild(preciptype)
    } else {
      const preciptype = document.createElement("img")
      preciptype.src = replaceIcon(data.forecast[i].preciptype[0])
      preciptype.height = 18
      precip.appendChild(preciptype)
    }
    precipContainer.appendChild(precip)

    // precipprob
    const precipprob = document.createElement("p")
    precipprob.className = "precipProb"
    precipprob.textContent = `${Math.round(data.forecast[i].precipprob)}%`
    precipContainer.appendChild(precipprob)
    dayContainer.appendChild(precipContainer)

    // wind container
    const windContainer = document.createElement("div")
    windContainer.className = "windContainer"

    // wind icon
    const wind = document.createElement("div")
    wind.className = "wind"
    const windicon = document.createElement("img")
    windicon.src = replaceIcon("wind")
    windicon.height = 13
    wind.appendChild(windicon)
    windContainer.appendChild(wind)

    // wind speed
    const windspeed = document.createElement("p")
    windspeed.className = "windSpeed"
    windspeed.textContent = `${Math.round(data.forecast[i].windspeed)} mph`
    windContainer.appendChild(windspeed)
    dayContainer.appendChild(windContainer)

    forecastContainer.appendChild(dayContainer)
  }
  forecastDiv.appendChild(forecastContainer)
  contentContainer.appendChild(forecastDiv)
}
