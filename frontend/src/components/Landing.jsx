import React, { useState } from 'react';
import { 
  Sun, Cloud, CloudRain, 
  MapPin, Thermometer, Wind, 
  Droplet, Compass, Search 
} from 'lucide-react';

const WeatherLandingPage = () => {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`http://localhost:5000/weather/${city}`);
      if (!response.ok) {
        throw new Error('City not found');
      }
      const data = await response.json();
      setWeatherData(data);
    } catch (err) {
      setError(err.message);
      setWeatherData(null);
    } finally {
      setLoading(false);
    }
  };

  const WeatherFeatureCard = ({ icon: Icon, title, description }) => (
    <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 text-center transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
      <Icon className="mx-auto mb-4 w-12 h-12 text-blue-400" />
      <h3 className="text-xl font-semibold mb-2 text-white">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900 text-white">
      {/* Navigation */}
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Compass className="w-8 h-8 text-blue-400" />
          <span className="text-2xl font-bold">WeatherSync</span>
        </div>
        <div className="space-x-6">
          <a href="#" className="hover:text-blue-300 transition">Home</a>
          <a href="#features" className="hover:text-blue-300 transition">Features</a>
          <a href="#about" className="hover:text-blue-300 transition">About</a>
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

          {/* Weather Result */}
          {loading && (
            <div className="mt-6 text-center animate-pulse text-blue-300">
              Fetching weather data...
            </div>
          )}

          {error && (
            <div className="mt-6 text-center text-red-400 bg-red-900/30 p-4 rounded-xl">
              {error}
            </div>
          )}

          {weatherData && (
            <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <MapPin className="mr-2 text-blue-400" />
                    {weatherData.name}, {weatherData.sys.country}
                  </h2>
                  <p className="text-4xl font-light mt-2">
                    {Math.round(weatherData.main.temp)}°C
                  </p>
                  <p className="text-blue-300 capitalize">
                    {weatherData.weather[0].description}
                  </p>
                </div>
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                    <Wind className="mr-2 text-blue-400" />
                    {weatherData.wind.speed} m/s
                  </div>
                  <div className="flex items-center">
                    <Droplet className="mr-2 text-blue-400" />
                    {weatherData.main.humidity}%
                  </div>
                </div>
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
          Why Choose <span className="text-blue-400">WeatherSync</span>?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <WeatherFeatureCard 
            icon={MapPin}
            title="Global Coverage"
            description="Get weather data for any city worldwide with just a few clicks."
          />
          <WeatherFeatureCard 
            icon={Thermometer}
            title="Precise Forecasts"
            description="Accurate temperature, humidity, and wind speed information."
          />
          <WeatherFeatureCard 
            icon={Compass}
            title="Easy to Use"
            description="Simple, intuitive interface for quick and effortless weather checks."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-6 py-8 text-center">
        <p className="text-gray-400">
          © 2024 WeatherSync. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default WeatherLandingPage;