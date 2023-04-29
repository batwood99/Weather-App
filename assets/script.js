// //write code to retrieve the city name from the form input when the user submits the form.
// Use the Open Weather Map API to retrieve the current weather data for the city entered by the user.
// Display the current weather information on the webpage, including the city name, date, weather icon, temperature, humidity, and wind speed.
// Use the Open Weather Map API to retrieve the 5-day forecast data for the city entered by the user.
// Display the 5-day forecast information on the webpage, including the date, weather icon, temperature, wind speed, and humidity.
// Implement a search history feature by storing the searched city names in the browser's local storage.
// Create a function to retrieve the search history from local storage and display it on the webpage.
// Add an event listener to the search history list items, so that when a user clicks on a previously searched city, the current and future weather conditions for that city are displayed.

var apiKey = '761e346dafa7493bf1d4e34f98aecb7c';
var citySearchEl = document.querySelector("#city-search");
var submitButtonEl = document.querySelector("#submit-btn");
var currentWeatherEl = document.querySelector("#todays-weather");
var futureWeatherEl = document.querySelector("#future-weather");
var cityListEl = document.querySelector("#last-cities-card");
var forecastTitleEl = document.querySelector("#forecast-title");
var lat;
var lon;
var searchHist = JSON.parse(localStorage.getItem("city")) || [];



function getTodaysWeather(city) {

    var weatherCall = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIKey;

    fetch(weatherCall)
    .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            var temp = data.list[0].main.temp;
            var wind = data.list[0].wind.speed;
            var humidity = data.list[0].main.humidity;
            var iconCode = data.list[0].weather[0].icon;
            var icon = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
            currentWeatherEl.innerHTML = '';
            displayTodaysWeather(temp, wind, humidity, icon, city);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (err) {
        alert('Unable to connect to OpenWeather');
      });

}

function displayTodaysWeather(temp, wind, hum, icon, city) {

    var date = dayjs().format('MMM D, YYYY');

    var dateEl = document.createElement('h2');
    var iconEl = document.createElement('img');
    iconEl.src = icon;
    dateEl.textContent = city + ' (' + date + ')';
    dateEl.appendChild(iconEl);
    currentWeatherEl.appendChild(dateEl);

    var tempEl = document.createElement('p');
    tempEl.textContent = 'Temperature: ' + temp + " °F";
    currentWeatherEl.appendChild(tempEl);

    var windEl = document.createElement('p');
    windEl.textContent = 'Wind: ' + wind + " MPH";
    currentWeatherEl.appendChild(windEl);

    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + hum + "%";
    currentWeatherEl.appendChild(humidityEl);

}

function getFutureWeather() {

    var weatherCall = 'https://api.openweathermap.org/data/2.5/forecast?lat=' + lat + '&lon=' + lon + '&units=imperial&appid=' + APIKey;

    var titleEl = document.createElement('h4');
    forecastTitleEl.innerHTML='';
    titleEl.textContent = '5-Day Forecast:'
    forecastTitleEl.appendChild(titleEl);

    fetch(weatherCall)
    .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            futureWeatherEl.innerHTML = '';
            for (var i = 1; i < 6; i++){
                var temp = data.list[i].main.temp;
                var wind = data.list[i].wind.speed;
                var humidity = data.list[i].main.humidity;
                var iconCode = data.list[i].weather[0].icon;
                var icon = 'https://openweathermap.org/img/wn/' + iconCode + '@2x.png';
                displayFutureWeather(temp, wind, humidity, icon, i);
            }
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });

    
}

function displayFutureWeather(temp, wind, hum, icon, i) {

    var date = dayjs().add(i, 'day').format('MMM D, YYYY');

    var cardEl = document.createElement('div');
    cardEl.classList = 'card';

    var dateEl = document.createElement('h6');
    var iconEl = document.createElement('img');
    iconEl.src = icon;
    dateEl.textContent = date;
    dateEl.appendChild(iconEl);
    cardEl.appendChild(dateEl);

    var tempEl = document.createElement('p');
    tempEl.textContent = 'Temperature: ' + temp + " °F";
    cardEl.appendChild(tempEl);

    var windEl = document.createElement('p');
    windEl.textContent = 'Wind: ' + wind + " MPH";
    cardEl.appendChild(windEl);

    var humidityEl = document.createElement('p');
    humidityEl.textContent = 'Humidity: ' + hum + "%";
    cardEl.appendChild(humidityEl);

    futureWeatherEl.appendChild(cardEl);
    
}

function getWeather() {
  var city = this.getAttribute("data-city");
  cityToCoord(city);
}

 function displaySearchHistory() {
    cityListEl.innerHTML = '';

    for (var i = 0; i < searchHist.length; i++){
        var buttonEl = document.createElement('button');
        buttonEl.classList = 'btn btn-secondary';
        buttonEl.setAttribute('type', 'button');
        buttonEl.textContent = searchHist[i];
        buttonEl.setAttribute("data-city", searchHist[i]);
        buttonEl.onclick = getWeather;
        cityListEl.appendChild(buttonEl);
    }
} 

function cityToCoord(city) {

    var coordinates = 'https://api.openweathermap.org/geo/1.0/direct?q=' + city + '&limit=1&appid=' + APIKey;

    fetch(coordinates)
    .then(function (response) {
        if (response.ok) {
          console.log(response);
          response.json().then(function (data) {
            console.log(data);
            var tempLat = data[0].lat;
            lat = tempLat.toFixed(2);
            var tempLon = data[0].lon;
            lon = tempLon.toFixed(2);
            getTodaysWeather(city);
            getFutureWeather();
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
      .catch(function (error) {
        alert('Unable to connect to OpenWeather');
      });

      displaySearchHistory();

}

displaySearchHistory();

submitButtonEl.addEventListener("click", function(e){
  e.preventDefault();
  searchHist = JSON.parse(localStorage.getItem("city")) || [];

    var citySearchVal = citySearchEl.value.trim();
    searchHist.unshift(citySearchVal);

    localStorage.setItem("city", JSON.stringify(searchHist));

    if (!citySearchVal) {
        console.error('You need a search input value!');
        return;
    }

    cityToCoord(citySearchVal);
})