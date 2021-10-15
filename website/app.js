// Global Variables
const zipCodeField = document.getElementById('zip');
const feelingsField = document.getElementById('feelings');

// I was directed to communicate with the open weather API on client side instead of server side, so I'm moving that here now.
const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const midUrl = ',us&appid=';  // *Assuming we only need to cover the United States, I added the 'us' instead of prompting for a country too
const apiKey = 'a53b2d8dc37f7179eb7025f975cc83b2';

document.getElementById('generate').addEventListener('click', generateButtonClickedHandler);

function generateButtonClickedHandler() {
  // Start with simple field validation before bothering to send off to server
  if (zipCodeField.value.length != 5)
    alert('You need to enter a 5 digit zip code, try again.');
  else if (isEmpty(feelingsField.value))
    alert('You need to enter your feelings. Don\'t be shy.');
  else {
    // First ensure the zip code is valid
    fetchJson(`${baseUrl}${zipCodeField.value}${midUrl}${apiKey}`)
    .then(apiResponse => {
      if (apiResponse.message && apiResponse.message === 'city not found') {
        alert('Invalid zip code provided, try again.');
        throw new Error(`Invalid zip code provided: ${zipCodeField.value}`);
      }

      let tempF = kelvinToFahrenheit(apiResponse.main.temp);
      return postData('/add', { "zipCode": zipCodeField.value, "temp": tempF, "feelings": feelingsField.value });
    })
    .then(addResponse => {
      let toJson = JSON.parse(addResponse);

      if (toJson.success)
        return fetchJson("/last");

      throw new Error('POST to /add route failed');
    })
    .then(lastResult => {
      updateLastEntryContent(getDate(), lastResult.temp, lastResult.zipCode, lastResult.feelings);
    })
    .catch(error => {
      console.log(error);
    });
  }
}

// The open weather API returns temperature values in degrees kelvin, but people typically don't use that unit of measurement
// This helper method will convert to degrees Fahrenheit since I'm from the United States.
function kelvinToFahrenheit(tempInKelvin) {
  return Math.trunc((tempInKelvin - 273.15) * (9 / 5) + 32);
}

// Helper function to simplify the work of updating display, by accessing the html elements and setting their text values
function updateLastEntryContent(date, temp, zipCode, feelings) {
  document.getElementById('date').innerText = `Date: ${date}`;
  document.getElementById('temp').innerText = `Temp: ${temp}` + '\xB0' + 'F';  // Add degrees F(ahrenheit) so users know units of measurement
  document.getElementById('content').innerText = `Zip code: ${zipCode}\nFeelings: ${feelings}`;
}

function getDate() {
  let d = new Date(); // Create a new date instance dynamically with JS
  return `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
}

// Generic fetch helper method for trying to obtain a resource at a url and converting it to JSON format
function fetchJson(url) {
  return fetch(url)
    .then(response => response.json())
    .catch(err => {
      console.error('fetch failed', err);
    });
}

const postData = async (url = '', data = {}) => {
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    try {
      const rcvData = await response.json();
      return JSON.stringify(rcvData);
    } catch(error) {
        console.log(`Logging error in postData: ${error}`);
    }
}

function isEmpty(str) {
  return !str.trim().length;
}
