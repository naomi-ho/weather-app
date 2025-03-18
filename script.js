async function getJson(location) {
  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?key=M6CKQHBJXEU36CWG263963LNU`,
      { mode: 'cors' },
    );
    const json = await response.json();
    console.log(json);
  } catch (err) {
    console.log('Error fetching data', err);
  }
}
