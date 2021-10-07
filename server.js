// Setup empty JS ARRAY to act as endpoint for all routes
projectData = [];

// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8000;
/*const baseUrl = 'api.openweathermap.org/data/2.5/weather?zip=';
const midUrl = ',us&appid=';  // *Assuming we only need to cover the United States, I added the 'us' instead of looking for a country code too
const apiKey = 'a53b2d8dc37f7179eb7025f975cc83b2';*/

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

/*app.get('/all', (req, res) => {
  console.log(`ALL route invoked, sending projectData: ${projectData}`);
  res.send(projectData);
});*/

/*function logFetch(url) {
  return fetch(url)
    .then(response => response.json())
    .then(json => {
      console.log(`json inside logFetch is: ${JSON.stringify(json)}`);
      return json;
    }).catch(err => {
      console.error('fetch failed', err);
    });
}*/

/*function getTempForZipCode(zipCode) {
  logFetch(baseUrl + zipCode + midUrl + apiKey)
    .then(result => {
      let tempKelvin = result.main.temp;
      console.log(`tempKelvin is: ${tempKelvin}`);
      return (tempKelvin - 273.15) * (9 / 5) + 32;
    });
}*/

/*app.get('/temp', (req, res) => {
  //let zip = req.body.zipCode;
  let temp = getTempForZipCode(90210);
  console.log(`in app.get('/temp') and temp found to be: ${temp}`);
  res.send({"temp": temp});
});*/

app.get('/last', (req, res) => {
  console.log(`LAST route invoked, sending projectData: ${projectData}`);

  if (projectData.length >= 1) {
    console.log('In /last route and projectData is NOT empty');
    res.send(projectData[projectData.length - 1]);
  } else {
    console.log('In /last route and projectData IS empty');
    res.send('No data to send');
  }
});

// Expecting body to contain the following fields: zipCode, feelings
app.post('/add', (req, res) => {
  console.log(`server.js /add route, req.body: zip = ${req.body.zipCode}, feelings = ${req.body.feelings}`);
  //res.send('Hello from the /add route!');
  projectData.push({ "zipCode": `${req.body.zipCode}`, "feelings": `${req.body.feelings}`});
  //console.log(`projectData is: ${JSON.stringify(projectData)}`);
});
