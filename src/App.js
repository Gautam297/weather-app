import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Get user's location on mount
  useEffect(() => {
    getUserLocation();
  }, []);

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherByCoords(position.coords.latitude, position.coords.longitude);
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  };

  const fetchWeatherByCoords = async (lat, lon) => {
    setLoading(true);
    setError('');
    
    try {
      const API_KEY = '895284fb2d2c50a520ea537456963d9c'; // Free demo key
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );
      
      if (!response.ok) throw new Error('Weather data not found');
      
      const data = await response.json();
      setWeather(data);
      setCity(data.name);
    } catch (err) {
      setError('Unable to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  const fetchWeather = async (e) => {
    e.preventDefault();
    if (!city.trim()) return;

    setLoading(true);
    setError('');

    try {
      const API_KEY = '895284fb2d2c50a520ea537456963d9c';
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`
      );

      if (!response.ok) throw new Error('City not found');

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError('City not found. Please try again.');
      setWeather(null);
    } finally {
      setLoading(false);
    }
  };

  const getClothingSuggestion = (temp) => {
    if (temp >= 30) {
      return {
        suggestion: 'Very Hot',
        clothes: '☀️ Light cotton clothes, shorts, t-shirt, sunglasses, and sunscreen',
        color: '#ff6b35'
      };
    } else if (temp >= 25) {
      return {
        suggestion: 'Hot',
        clothes: '🌞 Light clothes, short sleeves, comfortable fabrics',
        color: '#f7931e'
      };
    } else if (temp >= 20) {
      return {
        suggestion: 'Warm',
        clothes: '👕 Light shirt or t-shirt, jeans or light pants',
        color: '#fdc500'
      };
    } else if (temp >= 15) {
      return {
        suggestion: 'Mild',
        clothes: '🧥 Long sleeves, light jacket, comfortable pants',
        color: '#92d050'
      };
    } else if (temp >= 10) {
      return {
        suggestion: 'Cool',
        clothes: '🧥 Jacket or sweater, long pants, closed shoes',
        color: '#00b0f0'
      };
    } else if (temp >= 5) {
      return {
        suggestion: 'Cold',
        clothes: '🧥 Warm jacket, sweater, scarf, gloves',
        color: '#7030a0'
      };
    } else {
      return {
        suggestion: 'Very Cold',
        clothes: '🧣 Heavy winter coat, multiple layers, hat, gloves, scarf, warm boots',
        color: '#002060'
      };
    }
  };

  const getWeatherIcon = (main) => {
    const icons = {
      Clear: '☀️',
      Clouds: '☁️',
      Rain: '🌧️',
      Drizzle: '🌦️',
      Thunderstorm: '⛈️',
      Snow: '❄️',
      Mist: '🌫️',
      Fog: '🌫️',
      Haze: '🌫️'
    };
    return icons[main] || '🌤️';
  };

  return (
    <div className="App">
      <div className="container">
        <h1>🌤️ Weather & Clothing Advisor</h1>
        
        <form onSubmit={fetchWeather} className="search-form">
          <input
            type="text"
            placeholder="Enter city name..."
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-btn" disabled={loading}>
            {loading ? 'Searching...' : 'Search'}
          </button>
        </form>

        {error && <div className="error">{error}</div>}

        {weather && !loading && (
          <div className="weather-card">
            <div className="weather-header">
              <h2>{weather.name}, {weather.sys.country}</h2>
              <div className="weather-icon">
                {getWeatherIcon(weather.weather[0].main)}
              </div>
            </div>

            <div className="weather-info">
              <div className="temperature">
                <span className="temp-value">{Math.round(weather.main.temp)}°C</span>
                <span className="temp-desc">{weather.weather[0].description}</span>
              </div>

              <div className="weather-details">
                <div className="detail">
                  <span className="label">Feels like</span>
                  <span className="value">{Math.round(weather.main.feels_like)}°C</span>
                </div>
                <div className="detail">
                  <span className="label">Humidity</span>
                  <span className="value">{weather.main.humidity}%</span>
                </div>
                <div className="detail">
                  <span className="label">Wind Speed</span>
                  <span className="value">{weather.wind.speed} m/s</span>
                </div>
              </div>
            </div>

            <div 
              className="clothing-suggestion"
              style={{ borderLeftColor: getClothingSuggestion(weather.main.temp).color }}
            >
              <h3>👔 Clothing Suggestion</h3>
              <div className="suggestion-badge" style={{ 
                backgroundColor: getClothingSuggestion(weather.main.temp).color 
              }}>
                {getClothingSuggestion(weather.main.temp).suggestion}
              </div>
              <p className="suggestion-text">
                {getClothingSuggestion(weather.main.temp).clothes}
              </p>
            </div>
          </div>
        )}

        {!weather && !loading && !error && (
          <div className="welcome-message">
            <h2>Welcome! 👋</h2>
            <p>Enter a city name to get weather information and clothing suggestions.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
