import React, { useState } from 'react';
import { 
  Sun, Cloud, CloudRain, 
  MapPin, Thermometer, Wind, 
  Droplet, Compass, Search 
} from 'lucide-react';

// Weather icon mapping
const weatherIcons = {
  '01d': Sun,   // clear sky day
  '01n': Sun,   // clear sky night
  '02d': Cloud, // few clouds day
  '02n': Cloud, // few clouds night
  '03d': Cloud, // scattered clouds day
  '03n': Cloud, // scattered clouds night
  '04d': Cloud, // broken clouds day
  '04n': Cloud, // broken clouds night
  '09d': CloudRain, // shower rain day
  '09n': CloudRain, // shower rain night
  '10d': CloudRain, // rain day
  '10n': CloudRain, // rain night
  '11d': () => <CloudRain className="text-yellow-500" />, // thunderstorm day
  '11n': () => <CloudRain className="text-yellow-500" />, // thunderstorm night
  '13d': () => <Cloud className="text-white" />, // snow day
  '13n': () => <Cloud className="text-white" />, // snow night
  default: Sun
};

const WeatherApp = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost/weather?city=${encodeURIComponent(city)}`);
      const data = await response.json();

      if (response.ok) {
        setWeatherData(data);
      } else {
        setError(data.error || 'Unable to fetch weather data');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Render weather icon dynamically
  const WeatherIcon = weatherData 
    ? (weatherIcons[weatherData.current.icon] || weatherIcons.default)
    : weatherIcons.default;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Compass className="w-8 h-8 text-blue-400" />
          <span className="text-2xl font-bold">ClimaX</span>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="container mx-auto px-6 pt-20 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-5xl font-bold mb-6 leading-tight">
            Your <span className="text-blue-400">Personal Weather</span> Companion
          </h1>
          <p className="text-xl text-gray-300 mb-8">
            Get real-time, accurate weather information for any city in the world. Stay informed, stay prepared.
          </p>
          
          {/* Search Container */}
          <div className="flex space-x-4">
            <div className="relative flex-grow">
              <input 
                type="text" 
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchWeather()}
                placeholder="Enter city name"
                className="w-full p-4 pl-10 rounded-xl bg-white/20 backdrop-blur-lg border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <Search className="absolute left-3 top-4 text-gray-300" />
            </div>
            <button 
              onClick={fetchWeather}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 rounded-xl transition-colors"
            >
              Search
            </button>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="mt-6 text-center animate-pulse text-blue-300">
              Fetching weather data...
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-6 text-center text-red-400 bg-red-900/30 p-4 rounded-xl">
              {error}
            </div>
          )}

          {/* Weather Result */}
          {weatherData && (
            <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <WeatherIcon className="w-16 h-16" />
                  <div>
                    <h2 className="text-2xl font-bold flex items-center">
                      <MapPin className="mr-2 text-blue-400" />
                      {weatherData.location.name}, {weatherData.location.country}
                    </h2>
                    <p className="text-4xl font-light mt-2">
                      {Math.round(weatherData.current.temp)}°C
                    </p>
                    <p className="text-blue-300 capitalize">
                      {weatherData.current.description}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <Wind className="mr-2 text-blue-400" />
                    {weatherData.current.wind_speed} m/s
                  </div>
                  <div className="flex items-center">
                    <Droplet className="mr-2 text-blue-400" />
                    {weatherData.current.humidity}%
                  </div>
                </div>
              </div>

              {/* Forecast Preview */}
              <div className="mt-6 grid grid-cols-5 gap-4">
                {weatherData.forecast.map((forecast, index) => {
                  const ForecastIcon = weatherIcons[forecast.icon] || weatherIcons.default;
                  return (
                    <div 
                      key={index} 
                      className="bg-white/10 backdrop-blur-lg rounded-xl p-4 text-center"
                    >
                      <p className="text-sm mb-2">
                        {new Date(forecast.date).toLocaleDateString('en-US', { weekday: 'short' })}
                      </p>
                      <ForecastIcon className="mx-auto mb-2 w-10 h-10" />
                      <p>{Math.round(forecast.temp)}°C</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Hero Illustration */}
        <div className="hidden md:flex justify-center relative">
          <div className="w-96 h-96 bg-blue-500/20 absolute rounded-full blur-3xl"></div>
          <div className="relative z-10">
            <Cloud className="w-64 h-64 text-blue-300 animate-float" />
            <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center">
              <Thermometer className="w-32 h-32 text-white animate-bounce" />
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12">
          Why Choose <span className="text-blue-400">ClimaX</span>?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            {
              icon: MapPin,
              title: "Global Coverage",
              description: "Get weather data for any city worldwide with just a few clicks."
            },
            {
              icon: Thermometer,
              title: "Precise Forecasts",
              description: "Accurate temperature, humidity, and wind speed information."
            },
            {
              icon: Compass,
              title: "Easy to Use",
              description: "Simple, intuitive interface for quick and effortless weather checks."
            }
          ].map((feature, index) => (
            <div 
              key={index} 
              className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              <feature.icon className="mx-auto mb-4 w-12 h-12 text-blue-400" />
              <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center">
        <p className="text-gray-400">
          © 2024 ClimaX. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default WeatherApp;