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
      currentConditions: currentConditions,
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
form.addEventListener('submit', (e) => {
  e.preventDefault();

  console.log(locationInput.value);
  processJson(locationInput.value);

  // clears search bar after submission
  locationInput.value = null;
});
