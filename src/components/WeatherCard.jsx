const WEATHER_DESCRIPTIONS = {
  0: { text: 'Clear sky', icon: '\u2600\uFE0F' },
  1: { text: 'Mainly clear', icon: '\uD83C\uDF24\uFE0F' },
  2: { text: 'Partly cloudy', icon: '\u26C5' },
  3: { text: 'Overcast', icon: '\u2601\uFE0F' },
  45: { text: 'Foggy', icon: '\uD83C\uDF2B\uFE0F' },
  48: { text: 'Rime fog', icon: '\uD83C\uDF2B\uFE0F' },
  51: { text: 'Light drizzle', icon: '\uD83C\uDF26\uFE0F' },
  53: { text: 'Moderate drizzle', icon: '\uD83C\uDF26\uFE0F' },
  55: { text: 'Dense drizzle', icon: '\uD83C\uDF27\uFE0F' },
  61: { text: 'Slight rain', icon: '\uD83C\uDF27\uFE0F' },
  63: { text: 'Moderate rain', icon: '\uD83C\uDF27\uFE0F' },
  65: { text: 'Heavy rain', icon: '\uD83C\uDF27\uFE0F' },
  71: { text: 'Slight snow', icon: '\uD83C\uDF28\uFE0F' },
  73: { text: 'Moderate snow', icon: '\uD83C\uDF28\uFE0F' },
  75: { text: 'Heavy snow', icon: '\uD83C\uDF28\uFE0F' },
  80: { text: 'Slight showers', icon: '\uD83C\uDF26\uFE0F' },
  81: { text: 'Moderate showers', icon: '\uD83C\uDF27\uFE0F' },
  82: { text: 'Violent showers', icon: '\u26C8\uFE0F' },
  95: { text: 'Thunderstorm', icon: '\u26C8\uFE0F' },
  96: { text: 'Thunderstorm with hail', icon: '\u26C8\uFE0F' },
  99: { text: 'Thunderstorm with heavy hail', icon: '\u26C8\uFE0F' },
}

function getWeather(code) {
  return WEATHER_DESCRIPTIONS[code] || { text: 'Unknown', icon: '\u2753' }
}

function formatDay(dateStr) {
  const date = new Date(dateStr + 'T00:00:00')
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
}

function WeatherCard({ weather }) {
  const { location, current, currentUnits, daily } = weather
  const currentWeather = getWeather(current.weather_code)

  return (
    <div className="weather-card">
      <h2>{location}</h2>

      <div className="current-weather">
        <div className="weather-icon">{currentWeather.icon}</div>
        <div className="temperature">
          {Math.round(current.temperature_2m)}{currentUnits.temperature_2m}
        </div>
        <div className="description">{currentWeather.text}</div>
      </div>

      <div className="weather-details">
        <div className="detail">
          <span className="detail-label">Feels like</span>
          <span className="detail-value">
            {Math.round(current.apparent_temperature)}{currentUnits.apparent_temperature}
          </span>
        </div>
        <div className="detail">
          <span className="detail-label">Humidity</span>
          <span className="detail-value">
            {current.relative_humidity_2m}{currentUnits.relative_humidity_2m}
          </span>
        </div>
        <div className="detail">
          <span className="detail-label">Wind</span>
          <span className="detail-value">
            {current.wind_speed_10m} {currentUnits.wind_speed_10m}
          </span>
        </div>
      </div>

      <div className="forecast">
        <h3>5-Day Forecast</h3>
        <div className="forecast-days">
          {daily.time.map((date, i) => {
            const dayWeather = getWeather(daily.weather_code[i])
            return (
              <div key={date} className="forecast-day">
                <div className="day-name">{formatDay(date)}</div>
                <div className="day-icon">{dayWeather.icon}</div>
                <div className="day-temps">
                  <span className="high">{Math.round(daily.temperature_2m_max[i])}&deg;</span>
                  <span className="low">{Math.round(daily.temperature_2m_min[i])}&deg;</span>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default WeatherCard
