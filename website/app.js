/* Global Variables */
const zipCodeField = document.getElementById('zip_code_field');
const feelingsField = document.getElementById('feelings_field');

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const midUrl = ',us&appid=';  // *Assuming we only need to cover the United States, I added the 'us' instead of looking for a country code too
const apiKey = 'a53b2d8dc37f7179eb7025f975cc83b2';

document.getElementById('generate').addEventListener('click', generateButtonClickedHandler);

function generateButtonClickedHandler() {
  if (isEmpty(zipCodeField.value))
    alert('You need to enter a zip code');
  else if (isEmpty(feelingsField.value))
    alert('You need to enter your feelings');
  else {
    console.log(`In button click handler and zip = ${zipCodeField.value}, feelings = ${feelingsField.value}`);
    postData('/add', { "zipCode": `${zipCodeField.value}`, "feelings": `${feelingsField.value}` });
    logFetch('/last').then(result => {
      if (result === null)
        console.log('result is NULL in button click handler');
      else {
        document.getElementById('content').innerText = `The most recent zip is: ${result.zipCode}\n
          The most recent feelings are: ${result.feelings}`;
        document.getElementById('date').innerText = `Date: ${getDate()}`;
      }
    });

    logFetch(baseUrl + zipCodeField.value + midUrl + apiKey)
    .then(temp => {
      if (temp === undefined)
        console.log('final temp is UNDEFINED');
      else {
        console.log(`final temp is: ${temp.main.temp}`);
        let tempF = kelvinToFahrenheit(temp.main.temp);
        document.getElementById('temp').innerText = `Temp: ${tempF}` + '\xB0' + 'F';
      }
    })
    .catch(err => {
      console.error('fetch failed', err);
    });

    /*getTempForZipCode(zipCodeField.value).then(temp => {
      if (temp === null)
        console.log("app.js failed to get temp");
      else {
        console.log(`Temp is not null and equals: ${temp}`);
        document.getElementById('temp').innerText = `Temp: ${temp}`;
      }
    });*/
  }
}

function kelvinToFahrenheit(tempInKelvin) {
  return Math.trunc((tempInKelvin - 273.15) * (9 / 5) + 32);
}

function getTempForZipCode(zipCode) {
  console.log(`fetching temp for zip: ${zipCode}`);
  logFetch(baseUrl + zipCode + midUrl + apiKey)
    .then(result => {
      console.log(`returned result for url: ${baseUrl + zipCode + midUrl + apiKey} is: ${result}`);
      let tempKelvin = result.main.temp;
      console.log(`tempKelvin is: ${tempKelvin}`);
      return (tempKelvin - 273.15) * (9 / 5) + 32;
    });
}

function getDate() {
  // Create a new date instance dynamically with JS
  let d = new Date();
  //let newDate = d.getMonth() + '.' + d.getDate() + '.' + d.getFullYear();
  return `${d.getMonth()}/${d.getDate()}/${d.getFullYear()}`;
}

function logFetch(url) {
  return fetch(url)
    //.then(response => response.text())
    .then(response => response.json())
    .then(json => {
      console.log(`json inside logFetch is: ${JSON.stringify(json)}`);
      return json;
    }).catch(err => {
      console.error('fetch failed', err);
    });
}

const postData = async (url = '', data = {}) => {
    console.log(`Inside postData, url = ${url}, data = ${JSON.stringify(data)}`);
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    console.log('inside postData still, but before try block');
    try {
      console.log(`In postData try block, data posted was: ${JSON.stringify(data)}`);
      const rcvData = await response.json();
      console.log(`In postData try block, data received was: ${JSON.stringify(rcvData)}`);
      return JSON.stringify(rcvData);
    } catch(error) {
      if (error === null)
        console.log("There was an error");
      else
        console.log("error was NOT null, but I'm having trouble logging the error");
    }
}

const retrieveData = async (url = '') => {
  /*fetch(url).then(response => response.json()).then(data => {
    console.log(`retrieved zip = ${data.zip}, feelings = ${data.feelings}`);
  });*/
  console.log(`In retrieveData, about to call fetch(${url})`);
  const request = await fetch(url);

  try {
    console.log('retrieveData, before await request');
    const data = await request.json();
    console.log(`retrieveData, data is: ${data}`);
    //return data;
  } catch(error) {
    console.log(`${error.message}`);
  }
}

function isEmpty(str) {
  return !str.trim().length;
}

function postGet(data = {}) {
  console.log('in postGet...');
  postData('/add', data).then(function(result) {
    console.log('about to call retrieveData');
    retrieveData('/last');
    console.log('after retrieveData was called');
  });
  console.log('...done in postGet');
}
