function convertDate(unixtimestamp) {
  // Months array
  var months_arr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Convert timestamp to milliseconds
  var date = new Date(unixtimestamp * 1000);
  var month = months_arr[date.getMonth()];
  var day = date.getDate();
  var convdataTime = month + " " + day;

  return convdataTime;
}

function DateWithTime(unixtimestamp) {
  // Unixtimestamp

  // Months array
  var months_arr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  // Convert timestamp to milliseconds
  var date = new Date(unixtimestamp * 1000);

  // Year
  var year = date.getFullYear();

  // Month
  var month = months_arr[date.getMonth()];

  // Day
  var day = date.getDate();

  // Hours
  var hours = date.getHours();

  // Minutes
  var minutes = "0" + date.getMinutes();

  // Seconds
  var seconds = "0" + date.getSeconds();

  // Display date time in MM-dd-yyyy h:m:s format
  var convdataTime =
    month +
    "-" +
    day +
    "-" +
    year +
    " " +
    hours +
    minutes.substr(-2) +
    seconds.substr(-2) +
    " hours";

  return convdataTime;
}

$(document).ready(function () {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(showPosition);
  }

  function showPosition(position) {
    const lat = position.coords.latitude;
    const lan = position.coords.longitude;
    getWeatherData(lat, lan);
    
  }
});

// Listening Enter Key press
$("#location").keypress(function () {
  if (event.keyCode === 13) {
    $("#search").click();
  }
});

// Showing result from Search Bar
$("#search").click(function () {
  $("#landing").hide();
  $("#WeatherReport").hide();
  $("#loader").show();
  var cityname = $("#location").val();
  cityname = cityname.replace(/ /g, "%20");
  const LocationAPIKEY = "pk.8a3fc0ecf090befc8389e6d7ba556209";
  $.ajax({
    url: `https://us1.locationiq.com/v1/search.php?key=${LocationAPIKEY}&q=${cityname}&format=json`,
    success: function (response) {
      var lat = response[0].lat;
      var lan = response[0].lon;
      // Call Function to get weather data acc to lat lan
      getWeatherData(lat, lan);
    },
    error: function () {
      $("#landing").html(
        "<p>No such place found! <br>Make sure u spell the name correctly</p>"
      );
    },
  });
});

// Gettign Weather data from openWeather API
function getWeatherData(lat, lan) {
  const WeatherAPIKey = "cc1747ffb3d8256555e1f08bef345105";
  $.ajax({
    url: `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lan}&exclude=minutely,hourly&appid=${WeatherAPIKey}&units=metric`,
    beforeSend: function () {},

    complete: function () {
      $("#loader").hide();
      $("#WeatherReport").show();
    },
    success: function (weatherdata) {
      var sunrise = DateWithTime(weatherdata.current.sunrise);
      var sunset = DateWithTime(weatherdata.current.sunset);
      $("#landing").css("display", "none");
      $("#WeatherReport").html(
        `<!-- Weather Info-->
                    <div class="banner" style= "   background-image: 
                    linear-gradient(
                      rgba(0, 0, 0, 0.5),
                      rgba(0, 0, 0, 0.5)
                  ),
                  url(img/${weatherdata.current.weather[0].icon}.jpg);">
                        <div class="content">
                            <h3>Timezone: ${weatherdata.timezone}</h3>
                            <h1>${weatherdata.current.temp}&#8451; &nbsp;|&nbsp; ${weatherdata.current.weather[0].main}</h1>
                            <h6>Atmospheric Presure : ${weatherdata.current.pressure}hPa</h6>
                            <h6>Wind Speed : ${weatherdata.current.wind_speed}m/s</h6>
                            <h6>Humidity : ${weatherdata.current.humidity}%</h6>
                            <h6>Cloudiness : ${weatherdata.current.clouds}%</h6>
                        </div>
                    </div>     
              
                    <div class="container-fluid row">
                        <div class="col-sm-6">
                      <!-- Charts -->
                      <div class="row my-3">
                          <div class="col">
                              <h2 style = "text-align: center;">7 Day Forecast</h2>
                          </div>
                      </div>
                      <div class="row">
                          <div class="col-sm">
                              <div class="card">
                                  <div class="card-body">
                                      <canvas id="chLine"></canvas>
                                  </div>
                              </div>
                          </div>
                      </div>
                  </div>
                  <div class="col-sm-6 cards">
                      <div class="card">
                          <img class="card-img-top" src="img/sunrise.jpg" alt="Card image cap" height="250px">
                        <div class="card-body">
                          <h5 class="card-title" style="text-align: center;">Other Information</h5>
                          <p class="card-text" style ="text-align: center;"><b>Sunrise:</b> ${sunrise} | <b>Sunset:</b> ${sunset}<br><b>Midday UV Index:</b> ${weatherdata.current.uvi} | <b>Wind Direction:</b> ${weatherdata.current.wind_deg} degrees | <b>Feels Like:</b> ${weatherdata.current.feels_like}&#8451;</p>
                        </div>
                      </div>
                    </div>
                  </div>
              
                  <!-- Map Embed -->
                  <iframe width="100%" height="200px" frameborder="0" scrolling="no" style="border:0;" allowfullscreen="" aria-hidden="false" tabindex="0"  src="https://maps.google.com/maps?q=${weatherdata.lat},${weatherdata.lon}&hl=en&z=14&output=embed"></iframe>`
      );
      /* chart.js chart examples */

      // chart colors
      var colors = ["#007bff", "#28a745"];

      /* large line chart */
      var chLine = document.getElementById("chLine");
      var chartData = {
        labels: [
          convertDate(weatherdata.daily[0].dt),
          convertDate(weatherdata.daily[1].dt),
          convertDate(weatherdata.daily[2].dt),
          convertDate(weatherdata.daily[3].dt),
          convertDate(weatherdata.daily[4].dt),
          convertDate(weatherdata.daily[5].dt),
          convertDate(weatherdata.daily[6].dt),
        ],
        datasets: [
          {
            data: [
              weatherdata.daily[0].temp.max,
              weatherdata.daily[1].temp.max,
              weatherdata.daily[2].temp.max,
              weatherdata.daily[3].temp.max,
              weatherdata.daily[4].temp.max,
              weatherdata.daily[5].temp.max,
              weatherdata.daily[6].temp.max,
              weatherdata.daily[7].temp.max,
            ],
            backgroundColor: "transparent",
            borderColor: colors[0],
            borderWidth: 4,
            pointBackgroundColor: colors[0],
            label: "Max Temp",
          },
          {
            data: [
              weatherdata.daily[0].temp.min,
              weatherdata.daily[1].temp.min,
              weatherdata.daily[2].temp.min,
              weatherdata.daily[3].temp.min,
              weatherdata.daily[4].temp.min,
              weatherdata.daily[5].temp.min,
              weatherdata.daily[6].temp.min,
              weatherdata.daily[7].temp.min,
            ],
            backgroundColor: "transparent",
            borderColor: colors[1],
            borderWidth: 4,
            pointBackgroundColor: colors[1],
            label: "Min Temp",
          },
        ],
      };
      if (chLine) {
        new Chart(chLine, {
          type: "line",
          data: chartData,
          options: {
            scales: {
              xAxes: [
                {
                  ticks: {
                    beginAtZero: false,
                  },
                },
              ],
            },
            legend: {
              display: true,
              labels: {
                color: "rgb(255, 99, 132)",
              },
            },
            responsive: true,
          },
        });
      }
    },
  });
}