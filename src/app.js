
function formatDate(timestamp) {
    let date = new Date(timestamp);
    let day = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let days = day[date.getDay()];
    return `${days} ${formatHours(timestamp)} `;
  }
  
  function formatHours(timestamp) {
    let date = new Date(timestamp);
    let hours = date.getHours();
    if (hours < 10) {
      hours = `0${hours}`;
    }
    let minutes = date.getMinutes();
    if (minutes < 10) {
      minutes = `0${minutes}`;
    }
    return `${hours}:${minutes}`;
  }
  

  function findDay(timestamp) {
    let time = new Date(timestamp);
    let shortDay = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    let now = shortDay[time.getDay()];
    return `${now}`;
  }
  
  // Get Current Temperature
  function displayTemperature(response) {
    let cityElement = document.querySelector("#city");
    cityElement.innerHTML = response.data.name;
  
    celsiusTemperature = response.data.main.temp;
    let temperatureElement = document.querySelector("#temperature");
    temperatureElement.innerHTML = Math.round(celsiusTemperature);
  
    let descriptionElement = document.querySelector("#description");
    descriptionElement.innerHTML = response.data.weather[0].description;
  
    let humidityElement = document.querySelector("#humidity");
    humidityElement.innerHTML = response.data.main.humidity;
  
    let windElement = document.querySelector("#wind");
    windElement.innerHTML = response.data.wind.speed;
  
    let dateElement = document.querySelector("#date");
    dateElement.innerHTML = formatDate(response.data.dt * 1000);
  
    let iconElement = document.querySelector("#icon");
    iconElement.setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
    iconElement.setAttribute("alt", response.data.weather[0].description);
  }
  
  // Get Forecast -- Hourly Temperature
  function displayForecast(response) {
    let forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML = null;
    let forecast = null;
  
    for (let index = 0; index < 4; index++) {
      let forecast = response.data.list[index];
      forecastElement.innerHTML += `
      <div class="col-3">
        <h3>${formatHours(forecast.dt * 1000)}</h3>
        <img src="http://openweathermap.org/img/wn/${
          forecast.weather[0].icon
        }@2x.png"/>
        <div class="weather-forecast-temperature">
          <strong>${Math.round(forecast.main.temp_max)}° </strong>${Math.round(
        forecast.main.temp_min
      )}°
        </div>
      </div>`;
    }
  }
  
  // Get Forecast -- Daily Temperature
  function displayDaily(response) {
    let datesElement = document.querySelector("#daily");
    datesElement.innerHTML = null;
    let dates = null;
  
    for (let index = 1; index < 7; index++) {
      let dates = response.data.daily[index];
      datesElement.innerHTML += `
      <div class="col-2">
        <h3>${findDay(dates.dt * 1000)}</h3>
        <img src="http://openweathermap.org/img/wn/${
          dates.weather[0].icon
        }@2x.png"/>
        <div class="weather-forecast-temperature">
          <strong>${Math.round(dates.temp.max)}° </strong>${Math.round(
        dates.temp.min
      )}°
        </div>
      </div>`;
    }
  }
  
  // Get City thruough API Call api key reminder: 26b74735e8891f42e6bf64c6a73cf2bf
  function search(city) {
    let apiKey = "26b74735e8891f42e6bf64c6a73cf2bf";
    let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  
    axios.get(apiUrl).then(displayTemperature);
  
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(displayForecast);
  
    apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(apiUrl).then(find);
  }
  
  // Get Lat/Long thruough API Call // reminder 26b74735e8891f42e6bf64c6a73cf2bf
  function find(response) {
    let lat = response.data.city.coord.lat;
    let lon = response.data.city.coord.lon;
    let apiKey = "26b74735e8891f42e6bf64c6a73cf2bf";
    let url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${apiKey}&units=metric`;
    axios.get(url).then(displayDaily);
  }
  
  // Adding Event listener to Search Bar
  function handleSubmit(event) {
    event.preventDefault();
    let cityInputElement = document.querySelector("#city-input");
    search(cityInputElement.value);
  }
  
  // Display F
  function displayFahrenheitTemperature(event) {
    event.preventDefault();
    let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
    let temperatureElement = document.querySelector("#temperature");
    fahrenheitLink.classList.add("active");
    celsiusLink.classList.remove("active");
    temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
  }
  
  // Display C
  function displayCelsiusTemperature(event) {
    event.preventDefault();
    let temperatureElement = document.querySelector("#temperature");
    celsiusLink.classList.add("active");
    fahrenheitLink.classList.remove("active");
    temperatureElement.innerHTML = Math.round(celsiusTemperature);
  }
  
  let celsiusTemperature = null;
  
  let form = document.querySelector("#search-form");
  form.addEventListener("submit", handleSubmit);
  
  let fahrenheitLink = document.querySelector("#fahrenheit-link");
  fahrenheitLink.addEventListener("click", displayFahrenheitTemperature);
  
  let celsiusLink = document.querySelector("#celsius-link");
  celsiusLink.addEventListener("click", displayCelsiusTemperature);
  
  // Always Default Values
  search("Hoboken");
  