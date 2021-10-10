// Global Variables
const zipCodeField = document.getElementById('zip');
const feelingsField = document.getElementById('feelings');

document.getElementById('generate').addEventListener('click', generateButtonClickedHandler);

function generateButtonClickedHandler() {
  // Start with simple field validation before bothering to send off to server
  if (zipCodeField.value.length != 5)
    alert('You need to enter a 5 digit zip code, try again.');
  else if (isEmpty(feelingsField.value))
    alert('You need to enter your feelings. Don\'t be shy.');
  else {
    // Now it's okay to submit the simpily validated form data
    postData('/add', { "zipCode": `${zipCodeField.value}`, "feelings": `${feelingsField.value}` })
    // Next check if the server processed it successfully
    // Note that this could go wrong if the number passed in isn't actually a zip code- not all 5 digit values are
    .then(postResult => {
      let toJson = JSON.parse(postResult);

      if (toJson.success) {
        return fetchJson('/last');
      } else {
        alert('Invalid zip code entered, try again');
        throw new Error('invalid zip code provided'); // throw error so subsequent promise chain does not get executed- we skip to catch section below
      }
    })
    // Finally use the logged results to update the last entry fields on the home page
    .then(lastResult => {
        if (lastResult !== undefined)
          updateLastEntryContent(getDate(), lastResult.temp, lastResult.zipCode, lastResult.feelings);
    })
    .catch(error => {
      console.log(`found error: ${error}`);
    });
  }
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
