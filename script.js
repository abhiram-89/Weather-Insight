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
            .then((data) => this.displayWeather(data));
    },

    displayWeather: function(data) {
        const { name } = data; // data is object
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;

        console.log(name, icon, description, temp, humidity, speed);

        // To display the info on the page
        document.querySelector(".city").innerText = name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + " °C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + " %";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";

        document.querySelector(".weather-loading").classList.remove("loading");

        document.body.style.backgroundImage = "url('https://source.unsplash.com/1600x900/?" + name + "')";
    },

    // Search function
    search: function() {
        this.fetchWeather(document.querySelector(".search-bar").value);
    },
};

document.querySelector(".search button").addEventListener("click", function() {
    weather.search(); // Calling search function
});

document.querySelector(".search-bar").addEventListener("keyup", function(event) {
    if (event.key == "Enter") { // For Enter button
        weather.search();
    }
});
