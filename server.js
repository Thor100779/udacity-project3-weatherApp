// Setup empty JS ARRAY to act as endpoint for all routes
// I prefer an array over an object to store a collection of entries, even though we only display the most recent one in this app
projectData = [];

// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8000;

// I was having trouble using 'fetch' here and this was the solution I found
// I had initially did the open weather API lookup on the client side, but it strikes me as being more appropriate Here
// using 'axios.get()' allows me to request data from the API
const axios = require('axios');

const baseUrl = 'http://api.openweathermap.org/data/2.5/weather?zip=';
const midUrl = ',us&appid=';  // *Assuming we only need to cover the United States, I added the 'us' instead of prompting for a country too
const apiKey = 'a53b2d8dc37f7179eb7025f975cc83b2';

// Start up an instance of app
const app = express();

/* Middleware*/
//Here we are configuring express to use body-parser as middle-ware.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross origin allowance
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));

// Setup Server
app.listen(port, () => {
  console.log(`listening at localhost:${port}`);
});

// This route is used to get the last (successful) weather journal entry
app.get('/last', (req, res) => {
  if (projectData.length >= 1)
    res.send(projectData[projectData.length - 1]);
  else
    res.send('No data to send');
});

// Expecting the request body to contain the following fields: zipCode, feelings
app.post('/add', (req, res) => {
  // The axios.get() call is used to fetch from the open weather API
  axios.get(baseUrl + req.body.zipCode + midUrl + apiKey)
  .then(response => {
    // I don't know if this 'if' statement is needed, but when I tested the open weather API with invalid zip codes, I saw a message like this in the browser.
    // More recently I noticed invalid zip codes end up triggering the 'catch' clause below because of a 404 error.
    if (response.message && response.message === 'city not found') {
      throw new Error(`Invalid zip code provided: ${req.body.zipCode}`);
    }

    tempF = kelvinToFahrenheit(response.data.main.temp);
    projectData.push({ "zipCode": `${req.body.zipCode}`, "temp": tempF, "feelings": `${req.body.feelings}`});
    res.send({"success": true});
  })
  .catch(err => {
    res.send({"success": false});
  });
});

// The open weather API returns temperature values in degrees kelvin, but people typically don't use that unit of measurement
// This helper method will convert to degrees Fahrenheit since I'm from the United States.
function kelvinToFahrenheit(tempInKelvin) {
  return Math.trunc((tempInKelvin - 273.15) * (9 / 5) + 32);
}
