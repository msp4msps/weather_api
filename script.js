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

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  //Clear 5 Day forcast
  forecastList.textContent = "";
  //Get Current Weather
  getCity();
});

cityList.addEventListener("click", function (event) {
  event.preventDefault();
  if (event.target.className === "btn btn-secondary btn-block") {
    var location = event.target.id;
    console.log(location);
    searchText.textContent = location;
    getCity();
  } else {
    console.log("hetooo");
  }
});

function getCity() {
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${searchText.value}&units=imperial&appid=9b716091aa90cbcca7e67ce6002eb6ed`;
  fetch(url)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          currentDate = moment().format("MM/DD/YY");
          setLocationData(searchText.value);
          cityName.textContent = `${data.name} ${currentDate} `;
          temp.textContent = `Temp: ${data.main.temp} F`;
          wind.textContent = `Wind: ${data.wind.speed} MPH`;
          humdity.textContent = `Humidty: ${data.main.humidity} %`;
          uvUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude=hourly,daily&appid=9b716091aa90cbcca7e67ce6002eb6ed`;
          fetch(uvUrl).then(function (response) {
            response.json().then(function (data) {
              console.log(data);
              if (data.current.uvi < 2) {
                uvIndex.setAttribute("class", "green");
              } else if (data.curent.uvi > 2 && data.curent.uvi < 6) {
                uvIndex.setAttribute("class", "yellow");
              } else {
                uvIndex.setAttribute("class", "red");
              }
              uvIndex.textContent = `UVI: ${data.current.uvi}`;
            });
          });
          forcastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${searchText.value}&units=imperial&appid=9b716091aa90cbcca7e67ce6002eb6ed`;
          fetch(forcastUrl).then(function (response) {
            response.json().then(function (data) {
              console.log(data);
              const every_nth = (arr, nth) =>
                arr.filter((e, i) => i % nth === nth - 1);
              console.log(every_nth(data.list, 8));
              var fiveDays = every_nth(data.list, 8);
              for (i = 0; i < fiveDays.length; i++) {
                console.log(fiveDays[i]);
                var div = document.createElement("div");
                div.className = "card card-body";
                var date = document.createElement("h5");
                date.textContent = fiveDays[i].dt_txt.split(" ")[0];
                div.appendChild(date);
                var emoji = document.createElement("p");
                console.log(fiveDays[i].weather[0].main);
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
        alert("Error: " + response.statusText);
      }
    })
    .catch(function (error) {
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
    console.log(listCity);
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
    console.log(listCity[i]);
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

//Clicking on Previous Searches
