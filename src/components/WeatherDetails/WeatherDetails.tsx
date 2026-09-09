import {
  Droplets,
  Wind,
  Eye,
  Gauge,
  Sunrise,
  Sunset,
  SunMedium,
} from 'lucide-react'

import './WeatherDetails.css'

interface CurrentWeather {
  relative_humidity_2m: number
  wind_speed_10m: number
  pressure_msl: number
}

interface DailyWeather {
  sunrise: string[]
  sunset: string[]
  uv_index_max: number[]
}

interface WeatherDetailsProps {
  current: CurrentWeather
  daily: DailyWeather
  visibilityKm: number
}

interface WeatherDetailCard {
  icon: React.ReactNode
  label: string
  value: string
}

function WeatherDetails({
  current,
  daily,
  visibilityKm,
}: WeatherDetailsProps) {
  const sunrise = new Date(
    daily.sunrise[0]
  ).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const sunset = new Date(
    daily.sunset[0]
  ).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })

  const cards: WeatherDetailCard[] = [
    {
      icon: <Droplets size={24} />,
      label: 'Humidity',
      value: `${current.relative_humidity_2m}%`,
    },
    {
      icon: <Wind size={24} />,
      label: 'Wind Speed',
      value: `${Math.round(current.wind_speed_10m)} km/h`,
    },
    {
      icon: <Eye size={24} />,
      label: 'Visibility',
      value: `${visibilityKm} km`,
    },
    {
      icon: <Gauge size={24} />,
      label: 'Pressure',
      value: `${Math.round(current.pressure_msl)} hPa`,
    },
    {
      icon: <SunMedium size={24} />,
      label: 'UV Index',
      value: `${Math.round(daily.uv_index_max[0])}`,
    },
    {
      icon: <Sunrise size={24} />,
      label: 'Sunrise',
      value: sunrise,
    },
    {
      icon: <Sunset size={24} />,
      label: 'Sunset',
      value: sunset,
    },
  ]

  return (
    <section className="weather-details-section">
      <div className="container details-container">
        <h2 className="section-title">
          📊 Weather Details
        </h2>

        <div className="details-grid">
          {cards.map((card, index) => (
            <div
              className={`detail-card glass-card ${
                index === 6 ? 'last-detail-card' : ''
              }`}
              key={card.label}
            >
              <span className="detail-icon">
                {card.icon}
              </span>

              <p className="detail-label">
                {card.label}
              </p>

              <p className="detail-value">
                {card.value}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default WeatherDetails