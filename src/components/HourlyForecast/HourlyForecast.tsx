import {
  describeWeatherCode,
  formatHour,
  formatTemperature,
} from '../../utils/weatherUtils'
import { Droplets } from 'lucide-react'
import './HourlyForecast.css'

interface HourlyWeather {
  time: string[]
  weathercode: number[]
  temperature_2m: number[]
  precipitation_probability: number[]
}

interface HourlyForecastProps {
  hourly: HourlyWeather
  unit: 'C' | 'F'
  currentTime: string
}

function HourlyForecast({
  hourly,
  unit,
  currentTime,
}: HourlyForecastProps) {
  // Find the index of "now"
  const foundIndex = hourly.time.findIndex((t) => t >= currentTime)

  const startIndex = Math.max(0, foundIndex)

  // Take the next 12 hours
  const slice = hourly.time.slice(startIndex, startIndex + 12)

  return (
    <section id="forecast" className="container hourly-section">
      <h2 className="section-title">⏱️ Hourly Forecast</h2>

      <p className="section-subtitle">
        Next 12 hours at a glance.
      </p>

      <div className="hourly-scroll">
        {slice.map((time, i) => {
          const index = startIndex + i

          const codeInfo = describeWeatherCode(
            hourly.weathercode[index]
          )

          return (
            <div
              className="hourly-card glass-card"
              key={time}
            >
              <p className="hourly-time">
                {i === 0 ? 'Now' : formatHour(time)}
              </p>

              <div className="hourly-icon">
                {codeInfo.icon}
              </div>

              <p className="hourly-temp">
                {formatTemperature(
                  hourly.temperature_2m[index],
                  unit
                )}
              </p>

              <p className="hourly-rain">
                <Droplets size={13} />
                {hourly.precipitation_probability[index]}%
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default HourlyForecast