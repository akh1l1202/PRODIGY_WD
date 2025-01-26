const API_KEY = 'ba52c1fcd241bd459f5b1c9ce68ee7a7';
const locationInput = document.getElementById('locationInput');
const searchBtn = document.getElementById('searchBtn');
const geoBtn = document.getElementById('geoBtn');
const weatherInfo = document.getElementById('weatherInfo');

function fetchWeatherByLocation(location) {
    const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${API_KEY}&units=metric`;
    
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&appid=${API_KEY}&units=metric`;

    Promise.all([
        fetch(currentWeatherUrl).then(response => {
            if (!response.ok) throw new Error('Location not found');
            return response.json();
        }),
        fetch(forecastUrl).then(response => response.json())
    ])
    .then(([currentData, forecastData]) => {
        displayWeather(currentData, forecastData);
    })
    .catch(error => {
        weatherInfo.innerHTML = `<p class="error">${error.message}</p>`;
    });
}

function fetchWeatherByGeolocation() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(position => {
            const { latitude, longitude } = position.coords;
            
            const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;
            
            const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

            Promise.all([
                fetch(currentWeatherUrl).then(response => response.json()),
                fetch(forecastUrl).then(response => response.json())
            ])
            .then(([currentData, forecastData]) => {
                displayWeather(currentData, forecastData);
            })
            .catch(error => {
                weatherInfo.innerHTML = `<p class="error">Unable to fetch location weather</p>`;
            });
        }, () => {
            weatherInfo.innerHTML = `<p class="error">Geolocation permission denied</p>`;
        });
    } else {
        weatherInfo.innerHTML = `<p class="error">Geolocation not supported</p>`;
    }
}

function displayWeather(currentData, forecastData) {
    const { 
        name, 
        sys: { country }, 
        main, 
        wind, 
        clouds, 
        weather 
    } = currentData;

    const forecastDays = processForecast(forecastData);

    weatherInfo.innerHTML = `
        <div class="main-weather">
            <div>
                <h2>${name}, ${country}</h2>
                <div class="temperature">${Math.round(main.temp)}°C</div>
                <p>${weather[0].description}</p>
            </div>
            <img src="https://openweathermap.org/img/wn/${weather[0].icon}@2x.png" alt="Weather Icon" class="weather-icon">
        </div>

        <div class="weather-details">
            <div class="detail-item">
                <strong>Feels Like</strong>
                ${Math.round(main.feels_like)}°C
            </div>
            <div class="detail-item">
                <strong>Humidity</strong>
                ${main.humidity}%
            </div>
            <div class="detail-item">
                <strong>Wind</strong>
                ${Math.round(wind.speed)} m/s
            </div>
            <div class="detail-item">
                <strong>Pressure</strong>
                ${main.pressure} hPa
            </div>
            <div class="detail-item">
                <strong>Cloudiness</strong>
                ${clouds.all}%
            </div>
            <div class="detail-item">
                <strong>Visibility</strong>
                ${currentData.visibility / 1000} km
            </div>
        </div>

        <div class="forecast">
            ${forecastDays.map(day => `
                <div class="forecast-day">
                    <div>${day.day}</div>
                    <img src="https://openweathermap.org/img/wn/${day.icon}@2x.png" alt="Forecast Icon" style="width:50px;">
                    <div>${Math.round(day.temp)}°C</div>
                </div>
            `).join('')}
        </div>
    `;
}

function processForecast(forecastData) {
    const daysMap = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const dailyForecasts = forecastData.list.filter(forecast => 
        new Date(forecast.dt * 1000).getHours() === 12
    ).slice(0, 5);

    return dailyForecasts.map(forecast => ({
        day: daysMap[new Date(forecast.dt * 1000).getDay()],
        temp: forecast.main.temp,
        icon: forecast.weather[0].icon
    }));
}

searchBtn.addEventListener('click', () => {
    const location = locationInput.value.trim();
    if (location) fetchWeatherByLocation(location);
});

geoBtn.addEventListener('click', fetchWeatherByGeolocation);

locationInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const location = locationInput.value.trim();
        if (location) fetchWeatherByLocation(location);
    }
});