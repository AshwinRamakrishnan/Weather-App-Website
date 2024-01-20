function getWeather() {
  const apiKey = '04ff5442326d181819074d70fae3968d';
  const cityInput = document.getElementById('cityInput');
  const weatherResult = document.getElementById('weatherResult');
  const forecastContainer = document.getElementById('forecast');

  if (cityInput.value === '') {
      alert('Please enter a city name.');
      return;
  }

  const currentWeatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityInput.value}&appid=${apiKey}&units=metric`;
  const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${cityInput.value}&appid=${apiKey}&units=metric`;

  // Fetch current weather
  fetch(currentWeatherUrl)
      .then(response => response.json())
      .then(data => {
          const temperature = data.main.temp;
          const description = data.weather[0].description;
          const city = data.name;
          const overview = data.weather[0].main;
          const precipitation = data.rain ? `${data.rain['1h']} mm` : 'N/A';
          const humidity = data.main.humidity;
          const windSpeed = data.wind.speed;
          const iconCode = data.weather[0].icon;
          const iconUrl = `https://openweathermap.org/img/w/${iconCode}.png`;

          const resultHTML = `
              <p>${city}: ${temperature}°C, ${description} <img src="${iconUrl}" alt="Weather Icon"></p>
              <p>Overview: ${overview} <i class="fas fa-${getWeatherIcon(description)}"></i></p>
              <p>Precipitation: ${precipitation} <i class="fas fa-tint"></i></p>
              <p>Humidity: ${humidity}% <i class="fas fa-humidity"></i></p>
              <p>Wind Speed: ${windSpeed} m/s <i class="fas fa-wind"></i></p>
          `;
          weatherResult.innerHTML = resultHTML;
      })
      .catch(error => {
          console.error('Error fetching current weather data:', error);
          alert('Error fetching weather data. Please try again.');
      });

  // Fetch 5-day forecast
  fetch(forecastUrl)
      .then(response => response.json())
      .then(data => {
          const forecastData = data.list;
          let forecastHTML = '<h2>5-Day Forecast</h2><div class="forecast-items">';

          for (let i = 0; i < forecastData.length; i += 8) {
              const forecastDate = new Date(forecastData[i].dt * 1000);
              const forecastTemperature = forecastData[i].main.temp;
              const forecastDescription = forecastData[i].weather[0].description;
              const forecastIconCode = forecastData[i].weather[0].icon;
              const forecastIconUrl = `https://openweathermap.org/img/w/${forecastIconCode}.png`;

              forecastHTML += `
                  <div class="forecast-item">
                      <p>${formatDate(forecastDate)}</p>
                      <p>${forecastTemperature}°C <img src="${forecastIconUrl}" alt="Forecast Icon"></p>
                      <p>${forecastDescription} <i class="fas fa-${getWeatherIcon(forecastDescription)}"></i></p>
                  </div>
              `;
          }

          forecastHTML += '</div>';
          forecastContainer.innerHTML = forecastHTML;
      })
      .catch(error => {
          console.error('Error fetching forecast data:', error);
          alert('Error fetching forecast data. Please try again.');
      });
}

function formatDate(date) {
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
}

// Function to map weather description to FontAwesome icons
function getWeatherIcon(description) {
  switch (description) {
      case 'Clear':
          return 'sun';
      case 'Clouds':
          return 'cloud';
      case 'Rain':
          return 'cloud-rain';
      case 'Drizzle':
          return 'cloud-showers';
      case 'Thunderstorm':
          return 'bolt';
      case 'Snow':
          return 'snowflake';
      default:
          return 'question';
  }
}
