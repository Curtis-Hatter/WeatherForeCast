var today = new Date();
var cities = [];

if (localStorage.getItem("cities") !== null) {
    cities = JSON.parse(localStorage.getItem("cities"));
    for (var i = 0; i < cities.length; i++) {
        var cityListadd = $("<div>").addClass("city");
        cityListadd.text(cities[i]);
        $("#cities").append(cityListadd);
    }
}

createWeatherReport = function (cityName) {
    // console.log(cityName);
    var queryURL = "http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=5d906c5cc1a9d830abee251b8c9b4b0a";
    var lat = 0;
    var lon = 0;
    $.ajax({
        url: queryURL,
        method: "GET",
        success: function (url) {
            lat = url.coord.lat;
            lon = url.coord.lon;
            queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=minutely,hourly,alerts&units=imperial&appid=5d906c5cc1a9d830abee251b8c9b4b0a";
            createWeatherForecast(queryURL);
            $("h3").text(cityName + " " + today.toLocaleDateString());
        },
        error: function () {
            // console.log(error);
            // console.log(request);
            // console.log(status);
            alert("That city doesn't exit. Maybe, check your spelling?");
        }
    });
}
createWeatherForecast = function (queryURL) {
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        // console.log(response.current.uvi);
        $("h3").append($("<img>").attr({ "src": "http://openweathermap.org/img/w/" + response.daily[0].weather[0].icon + ".png", "alt": "weather icon" }));
        $("#Temp").text("Temperature: " + response.current.temp + " ℉");
        $("#humid").text("Humidity: " + response.current.humidity + "%");
        $("#wind").text("Wind Speed: " + response.current.wind_speed + " MPH");
        $("#uvi").text(response.current.uvi);
        colorassignment(response.current.uvi);
        $("#five-day").empty();
        for (var i = 1; i < 6; i++) {
            // console.log(date.addDays(i));
            var foreCastStats = $("<figure>");
            var foreCastDate = $("<h5>");
            var foreCastTemp = $("<p>");
            var foreCastHumid = $("<p>");
            var foreCastIcon = $("<img>");

            foreCastStats.addClass("daily-weather col-auto");
            foreCastIcon.attr({ "src": "http://openweathermap.org/img/w/" + response.daily[i].weather[0].icon + ".png", "alt": "weather icon" })
            foreCastDate.text(today.addDays(i).toLocaleDateString());
            foreCastTemp.text("Temp: " + response.daily[i].temp.day + " ℉");
            foreCastHumid.text("Humidity: " + response.daily[i].humidity + "%");

            foreCastStats.append(foreCastDate);
            foreCastStats.append(foreCastIcon);
            foreCastStats.append(foreCastTemp);
            foreCastStats.append(foreCastHumid);
            $("#five-day").append(foreCastStats);
        }
    })
}

colorassignment = function (number) {
    if (number <= 2) {
        $("#uvi").attr("class", "onetwo");
    }
    else if (number <= 5) {
        $("#uvi").attr("class", "threefive");
    }
    else if (number <= 7) {
        $("#uvi").attr("class", "sixseven");
    }
    else {
        $("#uvi").attr("class", "aboveeight");
    }
}

Date.prototype.addDays = function (days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}

populateHistory = function (city) {
    cities.push(city);
    localStorage.setItem("cities", JSON.stringify(cities));
}

$(".city-search").on("click", function () {
    var userCityChoice = $(".form-control").val();
    // console.log(userCityChoice);
    createWeatherReport(userCityChoice);
    var cityListadd = $("<div>").addClass("city city-search");
    cityListadd.text(userCityChoice);
    $("#cities").append(cityListadd);

    populateHistory(userCityChoice);
})

$(document).ready(function () {
    $(".city").on("click", function () {
        var userCityChoice = $(this).text();
        // console.log(userCityChoice);
        createWeatherReport(userCityChoice);
    })
})


$(".header").click(function () {
    // Event.stopPropation();
    var userCityChoice = "Riverside";
    if (cities.length === 1) {
        userCityChoice = cities[(cities.length - 1)];
    }
    else {
        userCityChoice = cities[(cities.length - 2)];
    }
    // console.log(userCityChoice);
    createWeatherReport(userCityChoice);
})

//SUPER QUESTions, click not responding?
// $(".header").click(function () {
//     // Event.stopPropation();
//     var userCityChoice = $(this).text();
//     console.log(userCityChoice);
//     createWeatherReport(userCityChoice);
// })