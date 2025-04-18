document.body.style.background = "url('background.jpg') no-repeat center center/cover";
document.body.style.backdropFilter = "blur(20px)";
document.body.style.backgroundColor = "rgba(255, 255, 255, 0.1)";

document.addEventListener("DOMContentLoaded", () => {
    const dateElement = document.getElementById("date");

    const updateDate = () => {
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

        const now = new Date();
        const dayName = days[now.getDay()];
        const dayNumber = now.getDate();
        const monthName = months[now.getMonth()];
        const year = now.getFullYear();

        dateElement.textContent = `${dayName}, ${dayNumber} ${monthName} ${year}`;
    };

    updateDate();
});

let weather = {
    "apiKey": "55987d4896385f75db74f8c4d5447b8b",

    fetchWeather: function(city) {
        fetch("https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey)
            .then((response) => response.json())
            .then((data) => this.displayCurrentWeather(data));

        // Fetch the 5-day forecast
        fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + this.apiKey)
            .then((response) => response.json())
            .then((data) => this.displayWeeklyForecast(data));
    },

    displayCurrentWeather: function(data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;

        document.querySelector(".city").innerText = name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + " °C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + " %";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";

        document.querySelector(".weather-loading").classList.remove("loading");

        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },

    displayWeeklyForecast: function(data) {
        const forecastContainer = document.querySelector(".forecast");
        forecastContainer.innerHTML = ""; // Clear previous forecast data

        const dailyForecasts = {};
        
        // Extract the closest data points to noon (12:00 PM) for each day
        data.list.forEach(item => {
            const date = item.dt_txt.split(" ")[0]; // Get only the date part
            const time = item.dt_txt.split(" ")[1]; // Get time part
            if (!dailyForecasts[date] && time === "12:00:00") { // Pick only the noon forecast
                dailyForecasts[date] = item;
            }
        });

        Object.keys(dailyForecasts).forEach(date => {
            const { temp } = dailyForecasts[date].main;
            const { icon, description } = dailyForecasts[date].weather[0];

            const dayElement = document.createElement("div");
            dayElement.classList.add("forecast-day");
            dayElement.innerHTML = `
                <p class="forecast-date">${date}</p>
                <img src="https://openweathermap.org/img/wn/${icon}.png" class="forecast-icon">
                <p class="forecast-temp">${temp} °C</p>
                <p class="forecast-desc">${description}</p>
            `;
            forecastContainer.appendChild(dayElement);
        });
    },

    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

document.querySelector(".search button").addEventListener("click", function() {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if (event.key === "Enter") {
        weather.search();
    }
});
