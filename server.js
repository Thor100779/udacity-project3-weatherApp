// I prefer an array over an object to store a collection of entries, even though we only display the most recent one in this app
// Reviewers insisted on an object so I switched back to that
projectData = {};

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

// This route is used to get the last (successful) weather journal entry
app.get('/last', (req, res) => {
    res.send(projectData);
});

// Expecting the request body to contain the following fields: zipCode, temp, feelings
app.post('/add', (req, res) => {
    if (req.body.zipCode && req.body.temp && req.body.feelings) {
      projectData = { "zipCode": req.body.zipCode, "temp": req.body.temp, "feelings": req.body.feelings};
      res.send({"success": true});
    }
    else {
      res.send({"success": false});
    }
});
