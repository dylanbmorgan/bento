// ┬ ┬┌─┐┌─┐┌┬┐┬ ┬┌─┐┬─┐
// │││├┤ ├─┤ │ ├─┤├┤ ├┬┘
// └┴┘└─┘┴ ┴ ┴ ┴ ┴└─┘┴└─
// Functions to setup Weather widget.

const iconElement = document.querySelector(".weatherIcon");
const tempElement = document.querySelector(".weatherValue p");
const descElement = document.querySelector(".weatherDescription p");

const weather = {};
weather.temperature = {
  unit: "celsius",
};

const tempUnit = CONFIG.weatherUnit;
const KELVIN = 273.15;

// This is the main function that starts the process.
function setPosition() {
  // Check if user wants to use browser's geolocation.
  if (CONFIG.trackLocation && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(onGeoSuccess, onGeoError);
  } else {
    // If geolocation is disabled, fetch the default weather.
    getWeather();
  }
}

// If geolocation is successful, fetch weather for those coordinates.
function onGeoSuccess(pos) {
  const lat = pos.coords.latitude.toFixed(3);
  const lon = pos.coords.longitude.toFixed(3);
  getWeather(lat, lon);
}

// If geolocation fails, fetch the default weather.
function onGeoError(err) {
  console.error(err);
  getWeather();
}

// This function now calls personal secure API endpoint.
function getWeather(latitude, longitude) {
  let api;

  if (latitude && longitude) {
    // If we have coordinates, send them to our API.
    api = `/api/weather?lat=${latitude}&lon=${longitude}`;
  } else {
    // Otherwise, call our API without coordinates to get the default.
    api = `/api/weather`;
  }

  fetch(api)
    .then(function (response) {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(function (data) {
      // All the logic for processing the data remains the same.
      let celsius = Math.floor(data.main.temp - KELVIN);
      weather.temperature.value = tempUnit == "C" ? celsius : (celsius * 9) / 5 + 32;
      weather.description = data.weather[0].description;
      weather.iconId = data.weather[0].icon;
      displayWeather();
    })
    .catch(function (error) {
      console.error("Error fetching weather data:", error);
      // Optionally, display an error message on the page.
      descElement.innerHTML = "Weather unavailable";
    });
}

function displayWeather() {
  iconElement.innerHTML = `<img src="assets/icons/${CONFIG.weatherIcons}/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value.toFixed(0)}°<span class="darkfg">${tempUnit}</span>`;
  descElement.innerHTML = weather.description;
}

// Start the whole process.
setPosition();
