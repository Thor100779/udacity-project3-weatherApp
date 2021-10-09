// Global Variables
const zipCodeField = document.getElementById('zip');
const feelingsField = document.getElementById('feelings');

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const midUrl = ',us&appid=';  // *Assuming we only need to cover the United States, I added the 'us' instead of asking for a country code too
const apiKey = 'a53b2d8dc37f7179eb7025f975cc83b2';

document.getElementById('generate').addEventListener('click', generateButtonClickedHandler);

function generateButtonClickedHandler() {
  if (isEmpty(zipCodeField.value) || zipCodeField.value.length != 5)
    alert('You need to enter a valid 5 digit zip code');
  else if (isEmpty(feelingsField.value))
    alert('You need to enter your feelings');
  else {
    postData('/add', { "zipCode": `${zipCodeField.value}`, "feelings": `${feelingsField.value}` });
    fetchJson('/last').then(result => {
        document.getElementById('content').innerText = `Zip code: ${result.zipCode}\n
          Feelings: ${result.feelings}`;
        document.getElementById('date').innerText = `Date: ${getDate()}`;
    });

    fetchJson(baseUrl + zipCodeField.value + midUrl + apiKey)
    .then(temp => {
        let tempF = kelvinToFahrenheit(temp.main.temp);
        document.getElementById('temp').innerText = `Temp: ${tempF}` + '\xB0' + 'F';  // Add indication
    })
    .catch(err => {
      console.error('fetch failed', err);
    });
  }
}

function kelvinToFahrenheit(tempInKelvin) {
  return Math.trunc((tempInKelvin - 273.15) * (9 / 5) + 32);
}

function getDate() {
  let d = new Date(); // Create a new date instance dynamically with JS
  return `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
}

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
        console.log(error);
    }
}

function isEmpty(str) {
  return !str.trim().length;
}
