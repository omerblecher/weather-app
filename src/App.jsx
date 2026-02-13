import { useState } from 'react'
import SearchBar from './components/SearchBar'
import WeatherCard from './components/WeatherCard'
import './App.css'

function App() {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleSearch(place) {
    setLoading(true)
    setError(null)
    setWeather(null)

    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(place)}&count=1`
      )
      const geoData = await geoRes.json()

      if (!geoData.results || geoData.results.length === 0) {
        throw new Error('Location not found. Please try a different search.')
      }

      const { latitude, longitude, name, country } = geoData.results[0]

      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}` +
        `&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m` +
        `&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=5`
      )
      const weatherData = await weatherRes.json()

      setWeather({
        location: `${name}, ${country}`,
        current: weatherData.current,
        currentUnits: weatherData.current_units,
        daily: weatherData.daily,
      })
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="app">
      <h1>Weather App</h1>
      <SearchBar onSearch={handleSearch} disabled={loading} />
      {loading && <p className="loading">Fetching weather data...</p>}
      {error && <p className="error">{error}</p>}
      {weather && <WeatherCard weather={weather} />}
    </div>
  )
}

export default App
