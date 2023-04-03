// //write code to retrieve the city name from the form input when the user submits the form.
// Use the Open Weather Map API to retrieve the current weather data for the city entered by the user.
// Display the current weather information on the webpage, including the city name, date, weather icon, temperature, humidity, and wind speed.
// Use the Open Weather Map API to retrieve the 5-day forecast data for the city entered by the user.
// Display the 5-day forecast information on the webpage, including the date, weather icon, temperature, wind speed, and humidity.
// Implement a search history feature by storing the searched city names in the browser's local storage.
// Create a function to retrieve the search history from local storage and display it on the webpage.
// Add an event listener to the search history list items, so that when a user clicks on a previously searched city, the current and future weather conditions for that city are displayed.

var apiKey = '761e346dafa7493bf1d4e34f98aecb7c';
var searchForm = document.querySelector('#search-form');
var searchInput = document.querySelector('#city-input');
var searchHistoryList = document.querySelector('#search-history ul');
var currentWeather = document.querySelector('#current-weather');
var forecast = document.querySelector('#forecast');

var searchHistory = [];

function getWeatherData(city) {
var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
return fetch(apiUrl)
    .then(response => {
    if (!response.ok) {
        throw new Error('Cannot retrieve data at this time.');
    }
    return response.json();
    })
    .then(data => {
    var weatherData = {
        city: data.name,
        date: new Date(),
        icon: data.weather[0].icon,
        temperature: data.main.temp,
        humidity: data.main.humidity,
        windSpeed: data.wind.speed,
    };

    var apiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;
    return fetch(apiUrl)
        .then(response => {
        if (!response.ok) {
            throw new Error('Cannot retrieve data at this time.');
        }
        return response.json();
        })
        .then(data => {
        var forecastData = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5);
        weatherData.forecast = forecastData.map(item => ({
            date: new Date(item.dt_txt),
            icon: item.weather[0].icon,
            temperature: item.main.temp,
            humidity: item.main.humidity,
            windSpeed: item.wind.speed,
        }));
        return weatherData;
        });
    });
}

function displayCurrentWeather(weatherData) {
var dateOptions = { weekday: 'long', month: 'long', day: 'numeric' };
currentWeather.innerHTML = `
    <h2>${weatherData.city} (${weatherData.date.toLocaleDateString('en-US', dateOptions)})</h2>
    <img src="https://openweathermap.org/img/w/${weatherData.icon}.png" alt="${weatherData.icon}">
    <p>Temperature: ${weatherData.temperature} &deg;C</p>
    <p>Humidity: ${weatherData.humidity} %</p>
    <p>Wind Speed: ${weatherData.windSpeed} m/s</p>
`;
}

function displayForecast(weatherData) {
var dateOptions = { weekday: 'short', month: 'short', day: 'numeric' };
forecast.innerHTML = `
    <h2>5-Day Forecast:</h2>
    <div class="forecast-items">
    ${weatherData.forecast.map(item => `
        <div class="forecast-item">
        <h3>${item.date.toLocaleDateString('en-US', dateOptions)}</h3>
        <img src="https://openweathermap.org/img/w/${item.icon}.png" alt="${item.icon}">
        <p>Temperature: ${item.temperature} &deg;C</p>
        <p>Humidity: ${item.humidity} %</p>
        <p>Wind Speed: ${item.windSpeed} m/s</p>
        </div>
    `).join('')}
    </div>
`;
}

function saveSearchHistory(city) {
if (!searchHistory.includes(city)) {
    searchHistory.push(city);
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
}
}

function loadSearchHistory() {
var savedSearchHistory = localStorage.getItem('searchHistory');
if (savedSearchHistory) {
    searchHistory = JSON.parse(savedSearchHistory);
    displaySearchHistory();
}
}

function displaySearchHistory() {
searchHistoryList.innerHTML = searchHistory.map(city => `
    <li><button>${city}</button></li>
`).join('');
}

function handleFormSubmit(event) {
event.preventDefault();
var city = searchInput.value.trim();
if (city) {
    getWeatherData(city)
    .then(weatherData => {
        displayCurrentWeather(weatherData);
        displayForecast(weatherData);
        saveSearchHistory(weatherData.city);
        displaySearchHistory();
    })
    .catch(error => {
        alert(error.message);
    });
}
searchInput.value = '';
}

function handleSearchHistoryClick(event) {
if (event.target.matches('button')) {
    var city = event.target.textContent;
    getWeatherData(city)
    .then(weatherData => {
        displayCurrentWeather(weatherData);
        displayForecast(weatherData);
    })
    .catch(error => {
        alert(error.message);
    });
}
}

searchForm.addEventListener('submit', handleFormSubmit);
searchHistoryList.addEventListener('click', handleSearchHistoryClick);

loadSearchHistory();