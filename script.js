var searchBtn = document.getElementById("searchBox");
var searchText = document.getElementById("form1");
var cityName = document.getElementById("cityName");
var wind = document.getElementById("wind");
var temp = document.getElementById("temp");
var humdity = document.getElementById("humdity");
var uvIndex = document.getElementById("uv");
var weatherText = document.querySelector(".text");
var forecastList = document.querySelector(".forecastList");
var cityList = document.getElementById("cityList");

//Get Weather Data when Searched
searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  //Clear 5 Day forcast
  forecastList.textContent = "";
  //Set Local Storage
  setLocationData(searchText.value);
  //Get Current Weather
  getCity();
});

//Get Weather data from Previous search
cityList.addEventListener("click", function (event) {
  event.preventDefault();
  if (event.target.className === "btn btn-secondary btn-block") {
    var location = event.target.id;
    searchText.value = location;
    forecastList.textContent = "";
    getCity();
  }
});

//Use Open Weather API to Collect Data
function getCity() {
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${searchText.value}&units=imperial&appid=9b716091aa90cbcca7e67ce6002eb6ed`;
  fetch(url)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          currentDate = moment().format("MM/DD/YY");
          cityName.textContent = `${data.name} ${currentDate} `;
          temp.textContent = `Temp: ${data.main.temp} F`;
          wind.textContent = `Wind: ${data.wind.speed} MPH`;
          humdity.textContent = `Humidty: ${data.main.humidity} %`;
          //URL For UV Index
          uvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,daily&appid=9b716091aa90cbcca7e67ce6002eb6ed`;
          fetch(uvUrl).then(function (response) {
            response.json().then(function (data) {
              //Color change depending on UV index
              if (data.current.uvi < 2) {
                uvIndex.setAttribute("class", "green");
              } else if (data.current.uvi > 2 && data.current.uvi < 6) {
                uvIndex.setAttribute("class", "yellow");
              } else {
                uvIndex.setAttribute("class", "red");
              }
              uvIndex.textContent = `UVI: ${data.current.uvi}`;
            });
          });
          //5 day forecast
          forcastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchText.value}&units=imperial&appid=9b716091aa90cbcca7e67ce6002eb6ed`;
          fetch(forcastUrl).then(function (response) {
            response.json().then(function (data) {
              //Get every 8th Array element that matches new day
              const every_nth = (arr, nth) =>
                arr.filter((e, i) => i % nth === nth - 1);
              var fiveDays = every_nth(data.list, 8);
              for (i = 0; i < fiveDays.length; i++) {
                //Create new card per day of forecast
                var div = document.createElement("div");
                div.className = "card card-body";
                var date = document.createElement("h5");
                date.textContent = fiveDays[i].dt_txt.split(" ")[0];
                div.appendChild(date);
                var emoji = document.createElement("p");
                //Determine Emoji to use depending on weather conditions
                if (fiveDays[i].weather[0].main == "Clouds") {
                  emoji.textContent = "☁️";
                } else if (fiveDays[i].weather[0].main == "Rain") {
                  emoji.textContent = "🌧";
                } else if (fiveDays[i].weather[0].main == "Clear") {
                  emoji.textContent = "☀️";
                }
                div.appendChild(emoji);
                var temp2 = document.createElement("h6");
                temp2.textContent = ` Temp: ${fiveDays[i].main.feels_like} F`;
                div.appendChild(temp2);
                var wind2 = document.createElement("h6");
                wind2.textContent = ` Wind: ${fiveDays[i].wind.speed} MPH`;
                div.appendChild(wind2);
                var humidity2 = document.createElement("h6");
                humidity2.textContent = ` Humidity: ${fiveDays[i].main.humidity} %`;
                div.appendChild(humidity2);
                forecastList.appendChild(div);
              }
            });
          });
        });
      } else {
        //Alert user if search returns an error
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
      //Redirect use if page is down
      alert("Unable to connect");
    });
}

//Set Loal Storage or garner previous searches
var cities = [];
function getLocationData() {
  if (localStorage.getItem("city") === null) {
    localStorage.setItem("city", JSON.stringify(cities));
  } else {
    listCity = JSON.parse(localStorage.getItem("city"));
  }
  renderSearchedCity();
}
getLocationData();

//Set new search into local storage
function setLocationData(city) {
  cities.push(city);
  localStorage.setItem("city", JSON.stringify(cities));
  addCity();
}

//Render all searched cities from Local Storage
function renderSearchedCity(city) {
  listCity = JSON.parse(localStorage.getItem("city"));
  for (i = 0; i < listCity.length; i++) {
    button = document.createElement("button");
    button.setAttribute("class", "btn btn-secondary btn-block");
    button.textContent = listCity[i];
    cityList.appendChild(button);
  }
}

//Add Cities to searched list
function addCity() {
  listCity = JSON.parse(localStorage.getItem("city"));
  button = document.createElement("button");
  button.textContent = listCity[listCity.length - 1];
  button.setAttribute("class", `btn btn-secondary btn-block`);
  button.setAttribute("id", `${button.textContent}`);
  cityList.appendChild(button);
}
