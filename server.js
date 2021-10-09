// Setup empty JS ARRAY to act as endpoint for all routes
projectData = [];

// Require Express to run server and routes
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const port = 8000;

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

app.get('/last', (req, res) => {
  if (projectData.length >= 1)
    res.send(projectData[projectData.length - 1]);
  else
    res.send('No data to send');
});

// Expecting body to contain the following fields: zipCode, feelings
app.post('/add', (req, res) => {
  projectData.push({ "zipCode": `${req.body.zipCode}`, "feelings": `${req.body.feelings}`});
});
