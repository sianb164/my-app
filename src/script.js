let days = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

let months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

// Search engine

let units = "metric";
let city = "";
let country = "";
let apiKey = "672723bd53f0c644c902cc3d0f7bbe45";
let changeCityForm = document.querySelector("#change-city-form");
let changeCityInput = document.querySelector("#change-city-input");
let currentCityEl = document.querySelector("#current-city");
let currentWindSpeedElement = document.querySelector("#current-wind-speed");
let currentHumidityElement = document.querySelector("#current-humidity");
let currentMaximumTempElement = document.querySelector("#current-maximum-temp");
let currentTempElement = document.querySelector("#current-temp");
let currentDescriptionElement = document.querySelector("#current-description");

let currentDateElement = document.querySelector("#current-date");

let iconElement = document.querySelector("#icon");

changeCityForm.addEventListener("submit", handleSubmit);

function handleSubmit(event) {
  event.preventDefault();
  city = changeCityInput.value;
  search();
}

function displayForecast(response) {
  let forecastElement = document.querySelector("#forecast");
  forecastElement.innerHTML = null;
  let forecast = null;

  for (let index = 0; index < 6; index++) {
    forecast = response.data.list[index];
    forecastElement.innerHTML += `
  <div class="col-2">
    <div class="forecast-time">
      ${formatHours(forecast.dt * 1000)}
    </div>
    <img
      src="http://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png"
    />
    <div class="weather-forecast-temperature">
      <strong>${Math.round(forecast.main.temp_max)}°</strong> ${Math.round(
      forecast.main.temp_min
    )}°
    </div>
  </div>
`;
  }
}

function search() {
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayWeather);

  apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`;
  axios.get(apiUrl).then(displayForecast);
}

function formatDate(timestamp) {
  let now = new Date(timestamp);
  let day = days[now.getUTCDay()];
  let date = now.getUTCDate();
  let month = months[now.getUTCMonth()];
  return `${day} ${date} ${month} ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
  let now = new Date(timestamp);
  let hours = now.getUTCHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = now.getUTCMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `${hours}:${minutes}`;
}

function displayWeather(response) {
  let currentTemperature = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description;
  country = response.data.sys.country;
  currentCityEl.innerHTML = `${response.data.name}, ${country}`;
  currentTempElement.innerHTML = currentTemperature;
  currentDescriptionElement.innerHTML = description;
  currentWindSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  currentHumidityElement.innerHTML = Math.round(response.data.main.humidity);
  currentMaximumTempElement.innerHTML = Math.round(response.data.main.temp_max);
  let timeAtLocation = response.data.dt + response.data.timezone;
  currentDateElement.innerHTML = formatDate(timeAtLocation * 1000);
  let weatherIcon = response.data.weather[0].icon;
  iconElement.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${weatherIcon}@2x.png`
  );
  iconElement.setAttribute("alt", description);
}

function displayWeatherCoords(response) {
  let currentTemperature = Math.round(response.data.main.temp);
  let description = response.data.weather[0].description;
  city = response.data.name;
  country = response.data.sys.country;
  currentTempElement.innerHTML = currentTemperature;
  currentCityEl.innerHTML = `${city}, ${country}`;
  currentDescriptionElement.innerHTML = description;
  currentWindSpeedElement.innerHTML = Math.round(response.data.wind.speed);
  currentHumidityElement.innerHTML = Math.round(response.data.main.humidity);
  currentMaximumTempElement.innerHTML = Math.round(response.data.main.temp_max);
  let timeAtLocation = response.data.dt + response.data.timezone;
  currentDateElement.innerHTML = formatDate(timeAtLocation * 1000);
}

// C to F
let currentTempUnitElements = document.querySelectorAll(".current-temp-unit");
let currentWindUnitElements = document.querySelectorAll("#current-wind-unit");
let celsiusButton = document.querySelector(".celsius-button");
let fahrenheitButton = document.querySelector(".fahrenheit-button");

function celsiusClick() {
  celsiusButton.classList.add("active", "btn-secondary");
  fahrenheitButton.classList.remove("active", "btn-secondary");
  fahrenheitButton.classList.add("btn-outline-secondary");
  units = "metric";
  setUnit("C", "mph");
  search();
}

function fahrenheitClick() {
  fahrenheitButton.classList.add("active", "btn-secondary");
  celsiusButton.classList.remove("active", "btn-secondary");
  celsiusButton.classList.add("btn-outline-secondary");
  units = "imperial";
  setUnit("F", "kph");
  search();
}

function setUnit(tempUnit, windUnit) {
  currentTempUnitElements.forEach(function (el) {
    el.innerHTML = tempUnit;
  });
  currentWindUnitElements.forEach(function (el) {
    el.innerHTML = windUnit;
  });
}

celsiusButton.addEventListener("click", celsiusClick);
fahrenheitButton.addEventListener("click", fahrenheitClick);

// Geolocation

let currentLocationButton = document.querySelector("#current-location-button");

function handlePosition(position) {
  celsiusButton.classList.add("active", "btn-secondary");
  fahrenheitButton.classList.remove("active", "btn-secondary");
  fahrenheitButton.classList.add("btn-outline-secondary");
  units = "metric";
  setUnit("C", "mph");
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayWeatherCoords);
}

function getCurrentPosition() {
  changeCityInput.value = "";
  navigator.geolocation.getCurrentPosition(handlePosition);
}

currentLocationButton.addEventListener("click", getCurrentPosition);

function loadPage() {
  city = "Oxford";
  search();
}

loadPage();
