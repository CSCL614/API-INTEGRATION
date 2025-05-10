async function getWeather() {
    const cityInput = document.getElementById('cityInput');
    const city = cityInput.value.trim();
    const weatherResult = document.getElementById('weatherResult');
    const loadingIndicator = document.getElementById('loadingIndicator');
    
    if (!city) {
      showError("Please enter a city name");
      return;
    }
  
    // Show loading indicator
    loadingIndicator.classList.remove('d-none');
    weatherResult.classList.add('d-none');
    
    const apiKey = '49b8d3be1eee5fa6d71bd21ae26a68f0'; // Replace with your actual OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
  
    try {
      const response = await fetch(url);
      
      // Hide loading indicator
      loadingIndicator.classList.add('d-none');
      
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("City not found. Please check the spelling and try again.");
        } else if (response.status === 401) {
          throw new Error("Invalid API key. Please check your API key configuration.");
        } else {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }
      }
  
      const data = await response.json();
  
      // Update weather information
      document.getElementById('cityName').textContent = data.name + ', ' + (data.sys.country || '');
      document.getElementById('temp').textContent = Math.round(data.main.temp * 10) / 10;
      document.getElementById('tempFeelsLike').textContent = Math.round(data.main.feels_like * 10) / 10;
      document.getElementById('description').textContent = data.weather[0].description;
      document.getElementById('humidity').textContent = data.main.humidity;
      document.getElementById('wind').textContent = data.wind.speed;
      
      // Update weather icon
      const iconCode = data.weather[0].icon;
      const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
      document.getElementById('weatherIcon').src = iconUrl;
      document.getElementById('weatherIcon').alt = data.weather[0].description;
  
      // Show the result
      weatherResult.classList.remove('d-none');
      
    } catch (error) {
      showError(error.message || "Failed to fetch weather data. Please try again.");
    }
  }
  
  function showError(message) {
    const errorAlert = document.getElementById('errorAlert');
    errorAlert.textContent = message;
    errorAlert.classList.remove('d-none');
    
    // Hide the error after 5 seconds
    setTimeout(() => {
      errorAlert.classList.add('d-none');
    }, 5000);
  }
  
  // Add event listener to allow pressing Enter key in the input field
  document.addEventListener('DOMContentLoaded', () => {
    const cityInput = document.getElementById('cityInput');
    
    cityInput.addEventListener('keypress', (event) => {
      if (event.key === 'Enter') {
        getWeather();
      }
    });
    
    // Add event listeners for recent searches if they exist
    const recentSearchButtons = document.querySelectorAll('.recent-search-btn');
    recentSearchButtons.forEach(button => {
      button.addEventListener('click', () => {
        document.getElementById('cityInput').value = button.textContent;
        getWeather();
      });
    });
  });