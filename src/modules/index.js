import '../style.css';

const form = document.getElementById('locationForm');
const locationInput = document.getElementById('location');

// takes location and returns weather data for that location
async function getJson(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=M6CKQHBJXEU36CWG263963LNU&in`,
      { mode: 'cors' },
    );
    const json = await response.json();
    console.log(json);
    return json;
  } catch (err) {
    console.log('Error fetching data:', err);
  }
}

// processes JSON data from API and returns object with only required data
async function processJson(location) {
  const json = await getJson(location);

  if (json) {
    const city = json.resolvedAddress;
    const currentConditions = json.currentConditions;
    const forecast = json.days;

    const processedData = {
      location: city,
      currentTemp: currentConditions.temp,
      currentDescription: currentConditions.conditions,
      currentMax: forecast[0].tempmax,
      currentMin: forecast[0].tempmin,
      forecast: forecast,
    };

    console.log('Processed data:', processedData);
    return processedData;
  } else {
    console.log('No JSON data received.');
    return null;
  }
}

// event listener for form submit button to fetch weather info
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  const data = await processJson(locationInput.value); // stores processed API result
  if (data) {
    displayCurrent(data);
    displayToday(data);
  }

  // clears search bar after submission
  locationInput.value = '';
});

// display current conditions (location, conditions, temp) + forecast[0] (tempmax, tempmin)
function displayCurrent(data) {
  const currentContainer = document.getElementById('current');
  currentContainer.innerHTML = '';
  currentContainer.id = 'currentDiv';

  // location
  const location = document.createElement('h3');
  location.textContent = data.location;
  currentContainer.appendChild(location);

  // temp
  const temp = document.createElement('h2');
  temp.textContent = `${data.currentTemp}°`;
  currentContainer.appendChild(temp);

  // condition
  const condition = document.createElement('p');
  condition.textContent = data.currentDescription;
  currentContainer.appendChild(condition);

  // high and low
  const tempRange = document.createElement('div');
  const tempMax = document.createElement('span');
  tempMax.textContent = `H: ${data.currentMax}°`;
  const tempMin = document.createElement('span');
  tempMin.textContent = `L: ${data.currentMin}°`;
  tempMin.style.paddingLeft = '10px';
  tempRange.appendChild(tempMax);
  tempRange.appendChild(tempMin);
  currentContainer.appendChild(tempRange);
}

// display today's description and hourly temp with icon
function displayToday(data) {
  const detailsContainer = document.getElementById('details');
  detailsContainer.innerHTML = '';
  detailsContainer.id = 'detailsDiv';

  // today's description
  const todayDescription = document.createElement('p');
  todayDescription.textContent = data.forecast[0].description;
  detailsContainer.appendChild(todayDescription);

  // hourly weather
  const todayContainer = document.createElement('div');
  const hourlyWeather = data.forecast[0].hours;
  console.log(hourlyWeather);

  for (let i = 0; i < hourlyWeather.length; i++) {
    const hourDiv = document.createElement('div');
    hourDiv.className = 'hourDiv';

    let displayTime;

    // convert to 12 hour format
    if (i === 0) {
      displayTime = '12 AM';
    } else if (i < 12) {
      displayTime = `${i} AM`;
    } else if (i === 12) {
      displayTime = '12 PM';
    } else {
      displayTime = `${i - 12} PM`;
    }

    const time = document.createElement('p');
    time.textContent = displayTime;
    hourDiv.appendChild(time);

    const icon = document.createElement('p');
    icon.textContent = hourlyWeather[i].icon;
    hourDiv.appendChild(icon);

    const temp = document.createElement('p');
    temp.textContent = `${hourlyWeather[i].temp}°`;
    hourDiv.appendChild(temp);

    todayContainer.appendChild(hourDiv);
  }

  detailsContainer.appendChild(todayContainer);
}
