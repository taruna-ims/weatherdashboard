import { describeWeatherCode, formatTemperature, formatWeekday } from '../../utils/weatherUtils'
import { Droplets } from 'lucide-react'
import './DailyForecast.css'


function DailyForecast({ daily, unit }) {
  return (
    <section className="container daily-section">
      <h2 className="section-title">📅 7-Day Forecast</h2>

      <div className="daily-list glass-card">
        {daily.time.map((date, index) => {
          const codeInfo = describeWeatherCode(daily.weathercode[index])
          return (
            <div className="daily-row" key={date}>
              <p className="daily-day">{index === 0 ? 'Today' : formatWeekday(date)}</p>
              <div className="daily-condition">
                <span className="daily-icon">{codeInfo.icon}</span>
                <span className="daily-label">{codeInfo.label}</span>
              </div>
              <p className="daily-rain">
                <Droplets size={13} /> {daily.precipitation_probability_max[index]}%
              </p>
              <p className="daily-temps">
                <span className="daily-max">{formatTemperature(daily.temperature_2m_max[index], unit)}</span>
                <span className="daily-min">{formatTemperature(daily.temperature_2m_min[index], unit)}</span>
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default DailyForecast
