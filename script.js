const form = document.getElementById('locationForm');
const locationInput = document.getElementById('location');

// takes location and returns weather data for that location
async function getJson(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=M6CKQHBJXEU36CWG263963LNU`,
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
