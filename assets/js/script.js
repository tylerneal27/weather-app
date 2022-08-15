
// when a city is searched the user in presented with weather stats
    // city name and date and an icon for weather conditions
    // uv index, temp, humidity, wind speed
    // uv index will have color for favorable, moderate, or severe weather
    // 5-day forecast that displays the date, an icon representation of weather conditions, the temperature, the wind speed, and the humidity 
// when cities in the history are clicked that cities weather appears again        
// when city is searched for put in local storage and make appear in history 
    // last searched city will pop up on the page
var apiKey = 'b0469f4e1c3f9253b3981f03d9af2f82'
var cityInput = document.getElementById('cityInputs')
var citySearch = document.getElementById('citySearch')

function weatherData(lat,lon,name) {
var url = 'https://api.openweathermap.org/data/2.5/onecall?units=imperial&lat=' + lat + '&lon=' + lon + '&appid=' + apiKey

fetch(url)
.then(function(response) {
    return response.json();
})
.then(function(data) {
    console.log(data);
    var cityName = document.getElementById('cityName')
    var temp = document.getElementById('temp')
    var weatherIcon = document.getElementById('weatherIcon')
    cityName.textContent = name
    temp.textContent = data.current.temp
    weatherIcon.src = 'http://openweathermap.org/img/wn/' + data.current.weather[0].icon + '@2x.png'
})
}
function locationData() {
    var cityName = cityInput.value
var url = 'http://api.openweathermap.org/geo/1.0/direct?q=' + cityName + '&appid=' + apiKey

fetch(url)
.then(function(response) {
    return response.json();
})
.then(function(data) {
    console.log(data);
    var lat = data [0].lat
    var lon = data [0].lon
    var name = data [0].name
    weatherData(lat,lon,name)
    
})
}



citySearch.addEventListener('click', locationData)