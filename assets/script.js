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
    var apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
}