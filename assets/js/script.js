// when a city is searched the user in presented with weather stats
// city name and date and an icon for weather conditions
// uv index, temp, humidity, wind speed
// uv index will have color for favorable, moderate, or severe weather
// 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity
// when cities in the history are clicked that cities weather appears again
// when city is searched for put in local storage and make appear in history
// last searched city will pop up on the page
var apiKey = "b0469f4e1c3f9253b3981f03d9af2f82";
var cityInput = document.getElementById("cityInputs");
var citySearch = document.getElementById("citySearch");
var showHistoryDivider = false
var fiveDay = document.getElementById('fiveDay');

function weatherData(lat, lon, name) {
  var url =
    "https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=" + lat + "&lon=" + lon + "&appid=" + apiKey;

  fetch(url, {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);

      document.getElementById("currentWeather").removeAttribute("hidden");
      var cityNameEl = document.getElementById("cityName");
      var dateEl = document.getElementById("date");
      var tempEl = document.getElementById("temp");
      var weatherIcon = document.getElementById("weatherIcon");
      var humidityEl = document.getElementById("humidity");
      var windEl = document.getElementById("wind");

      cityNameEl.textContent = name;
      var date = new Date(data.current.dt * 1000);
      dateEl.textContent = date.toLocaleDateString();
      tempEl.textContent = data.current.temp + " °F";
      formatUVIndex(data.current.uvi);
      humidityEl.textContent = data.current.humidity + " %";
      windEl.textContent = data.current.wind_speed + " mph";

      weatherIcon.src = "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png";
    //   function to build cards
      fiveDay.innerHTML = '';
      for (var i = 1; i < 6; i++) {
        var cardE = document.createElement('div')
        var dateE = document.createElement('h4')
        var iconE = document.createElement('img')
        var tempE = document.createElement('p')
        var windE = document.createElement('p')
        var humidityE = document.createElement('p')

        var dateFiveDay = new Date(data.daily[i].dt * 1000);
        dateE.textContent = dateFiveDay.toLocaleDateString();
        iconE.src = "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png";
        tempE.textContent = 'Temp: ' + data.daily[i].temp.day + " °F";
        windE.textContent = 'Wind Speed: ' + data.daily[i].wind_speed + " mph";
        humidityE.textContent = 'Humidity: ' + data.daily[i].humidity + " %";

        cardE.append(dateE,iconE,tempE,humidityE,windE)
        fiveDay.append(cardE)
      }
    });
}
function locationData() {
  var cityName = cityInput.value;
  var url = "http://api.openweathermap.org/geo/1.0/direct?q=" + cityName + "&appid=" + apiKey;

  fetch(url, {
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  })
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      console.log(data);
      var lat = data[0].lat;
      var lon = data[0].lon;
      var name = data[0].name;
    updateCityHistory(name, lat, lon)
      weatherData(lat, lon, name);
    })
    .catch(function (error) {
        alert('please enter a valid city.')
    })
}

function updateCityHistory(name, lat, lon) {
    if(!localStorage.getItem(name)) {
        var coordinates = {
            lat,
            lon
        }
        localStorage.setItem(name, JSON.stringify(coordinates))
        if(localStorage.length === 1) {
            showHistoryDivider = true
        }
        addCityToHistory(name)
    }
}
function addCityToHistory(name) {
    var searchHistoryEl = document.getElementById('searchHistory')
    if(showHistoryDivider){
        var hr = document.getElementById('historyDivider')
        hr.removeAttribute('hidden')
        showHistoryDivider = false
    }
    var cityButton = document.createElement('button')

    cityButton.textContent = name
    cityButton.classList.add('btn', 'btn-secondary', 'btn-block')
    cityButton.setAttribute('data-city', name)
    cityButton.addEventListener('click', function() {
        var cityName = this.getAttribute('data-city')
        var coordinates = JSON.parse(localStorage.getItem(cityName))
        weatherData(coordinates.lat, coordinates.lon, name)
    })

    searchHistoryEl.append(cityButton)

}


function formatUVIndex(uvIndex) {
  var uvIndexEl = document.getElementById("uvIndex");
  uvIndexEl.textContent = uvIndex;
  console.log(uvIndex);
  if (uvIndex >= 7) {
    uvIndexEl.classList.add("badge", "badge-pill", "badge-danger");
    uvIndexEl.classList.remove('badge-success')
    uvIndexEl.classList.remove('badge-warning')

  } else if (uvIndex >= 4) {
    uvIndexEl.classList.add("badge", "badge-pill", "badge-warning");
    uvIndexEl.classList.remove('badge-danger')
    uvIndexEl.classList.remove('badge-success')
  } else {
    uvIndexEl.classList.add("badge", "badge-pill", "badge-success");
    uvIndexEl.classList.remove('badge-danger')
    uvIndexEl.classList.remove('badge-warning')
  }
}

citySearch.addEventListener("click", locationData);


document.addEventListener('DOMContentLoaded', function() {
    for (var index = 0; index < localStorage.length; index++) {
        if(index === 0) {
            showHistoryDivider = true
        }
        var name = localStorage.key(index)
        var url = localStorage.getItem(name)
        addCityToHistory(name,url)
    }
});