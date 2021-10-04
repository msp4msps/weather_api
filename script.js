var searchBtn = document.getElementById("searchBox");
var searchText = document.getElementById("form1");
var cityName = document.getElementById("cityName");
var wind = document.getElementById("wind");
var temp = document.getElementById("temp");
var humdity = document.getElementById("humdity");
var uvIndex = document.getElementById("uv");
var weatherText = document.querySelector(".text");
var forecastList = document.querySelector(".forecastList");

searchBtn.addEventListener("click", function (event) {
  event.preventDefault();
  var url = `https://api.openweathermap.org/data/2.5/weather?q=${searchText.value}&units=imperial&appid=9b716091aa90cbcca7e67ce6002eb6ed`;
  fetch(url)
    .then(function (response) {
      if (response.ok) {
        response.json().then(function (data) {
          console.log(data);
          currentDate = moment().format("MM/DD/YY");
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
        weatherText.textContent = "Error: " + response.statusText;
      }
    })
    .catch(function (error) {
      alert("Unable to connect");
    });
});
