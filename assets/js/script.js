$("#d0").text(moment().format("M/D/YYYY"));
$("#d1").text(moment().add(1, 'days').format("M/D/YYYY"));
$("#d2").text(moment().add(2, 'days').format("M/D/YYYY"));
$("#d3").text(moment().add(3, 'days').format("M/D/YYYY"));
$("#d4").text(moment().add(4, 'days').format("M/D/YYYY"));

function searchFunction() {
    var searchTerm = document.querySelector("#city-input").value; 

    save(searchTerm);

    // fetch to get city coordinates
    fetch(
        'http://api.openweathermap.org/geo/1.0/direct?q=' +
        searchTerm + 
        ',US&limit=1&appid=d9f73f6f6bdc11fc127daf6cb161ebc8'
    ).then(function(response) {
        return response.json();
    }).then(function(response) {
        console.log(response[0]);
         $("#city-date").text(response[0].name + " " + "(" +  moment().format("M/D/YYYY") + ")");

         var lat = response[0].lat;
         var lon = response[0].lon;

        // fetch to get location info with coordinates
         fetch("https://api.openweathermap.org/data/2.5/onecall?lat=" + 
         lat + "&lon=" + lon + "&units=imperial&appid=d9f73f6f6bdc11fc127daf6cb161ebc8")
         .then(function(response) {
             return response.json();
         }).then(function(response) {
             console.log(response);

             var temp = response.current.temp;
             var wind = response.current.wind_speed;
             var humidity = response.current.humidity;
             var uvi = response.current.uvi;

            // contional statement to give the uvi a color
             if (uvi <= 2 ) {
                 $("#uv").addClass("low-uv");
             }
             else if (uvi >= 2.01 && uvi <= 7) {
                $("#uv").addClass("mod-uv");
             }
             else if (uvi >= 7.01) {
                $("#uv").addClass("hi-uv");
             };
             
            
            //display current day info 
            $("#current-temp").text("Temp: " + temp + "°F");
            $("#current-wind").text("Wind: " + wind + " mph");
            $("#current-hum").text("Humidity: " + humidity + "%");
            $("#uv").text("UV Index: " + uvi);
            
             // display 5 day forecast info
            for (var i = 0; i < 6; i++) {
            $("#d" + i + "temp").text("Temp: " + response.daily[i].temp.eve + "°F");
            $("#d" + i + "wind").text("Wind: " + response.daily[i].wind_speed + " mph");
            $("#d" + i + "hum").text("Humidity: " + response.daily[i].humidity + "%");

            var iconcode = response.daily[i].weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";

            $("#icon" + i).attr('src', iconurl);
            }

         });
    });

}
// shows search history list 
function renderCities() {
    var cityArr = JSON.parse(localStorage.getItem("saved-cities"))
    || [];
    for (var i = 0; i < cityArr.length; i++) {
        const cityName = cityArr[i];
        var li = $("<li>");
        var button = $("<button>");
        button.text(cityName);
        button.addClass("history-btns")
        li.append(button);
        $("#city-list").append(li);
      
    }
}
// save function
function save(city) { 
    var cityArr = JSON.parse(localStorage.getItem("saved-cities"))
    || [];
    cityArr.push(city);
    localStorage.setItem("saved-cities", JSON.stringify(cityArr));
} 

renderCities();

$(".history-btns").click(function() {
    var city = ($(this)[0].innerText);
    document.querySelector("#city-input").value = city;
   
    searchFunction()
})

 function showLast() {
     var cities = JSON.parse(localStorage.getItem("saved-cities"));
     var lastCity = cities[cities.length - 1];
     document.querySelector("#city-input").value = lastCity;
     searchFunction();

}
showLast();
