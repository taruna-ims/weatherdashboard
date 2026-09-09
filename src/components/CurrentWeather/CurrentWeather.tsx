import { Heart } from 'lucide-react'
import SearchBar from '../SearchBar/SearchBar'
import {
  formatFullDate,
  formatTemperature,
  getHeroMessage,
} from '../../utils/weatherUtils'
import './CurrentWeather.css'

interface Location {
  name: string
  country?: string
  latitude: number
  longitude: number
}

interface CurrentWeatherData {
  temperature_2m: number
  apparent_temperature: number
}

interface DailyWeatherData {
  temperature_2m_max: number[]
  temperature_2m_min: number[]
}

interface CodeInfo {
  group: string
  label: string
  icon: React.ReactNode
}

interface CurrentWeatherProps {
  location: Location
  current: CurrentWeatherData
  daily: DailyWeatherData
  codeInfo: CodeInfo
  isNight: boolean
  unit: 'C' | 'F'
  onSearch: (city: string) => void
  onUseLocation: () => void
  locating: boolean
  isFavorite: boolean
  onToggleFavorite: () => void
}

function CurrentWeather({
  location,
  current,
  daily,
  codeInfo,
  isNight,
  unit,
  onSearch,
  onUseLocation,
  locating,
  isFavorite,
  onToggleFavorite,
}: CurrentWeatherProps) {
  const now = new Date()

  return (
    <section id="weather" className="hero-section">
      <div className="hero-decorations" aria-hidden="true">

        {codeInfo.group === 'sunny' && !isNight && (
          <div className="deco-sun" />
        )}

        {codeInfo.group === 'rain' && (
          <div className="deco-rain">
            {Array.from({ length: 24 }).map((_, i) => (
              <span
                key={i}
                style={{
                  left: `${(i * 4.2) % 100}%`,
                  animationDelay: `${(i % 6) * 0.2}s`,
                }}
              />
            ))}
          </div>
        )}

        {codeInfo.group === 'snow' && (
          <div className="deco-snow">
            {Array.from({ length: 18 }).map((_, i) => (
              <span
                key={i}
                style={{
                  left: `${(i * 5.5) % 100}%`,
                  animationDelay: `${(i % 6) * 0.4}s`,
                }}
              >
                ❄
              </span>
            ))}
          </div>
        )}

        {codeInfo.group === 'cloudy' && (
          <div className="deco-clouds">
            <span className="cloud cloud-1">☁️</span>
            <span className="cloud cloud-2">☁️</span>
          </div>
        )}

        {isNight && (
          <div className="deco-stars">
            {Array.from({ length: 22 }).map((_, i) => (
              <span
                key={i}
                style={{
                  top: `${(i * 13) % 90}%`,
                  left: `${(i * 17) % 100}%`,
                  animationDelay: `${(i % 5) * 0.4}s`,
                }}
              />
            ))}
          </div>
        )}
      </div>

      <div className="container hero-inner">

        <div className="hero-top-row">
          <div>
            <h1 className="hero-location">
              {location.name}
              {location.country ? `, ${location.country}` : ''}
            </h1>

            <p className="hero-date">
              {formatFullDate(now)} ·{' '}
              {now.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              })}
            </p>
          </div>

          <button
            className={`favorite-heart ${isFavorite ? 'active' : ''}`}
            onClick={onToggleFavorite}
            aria-label={
              isFavorite
                ? 'Remove from favorites'
                : 'Add to favorites'
            }
          >
            <Heart
              size={22}
              fill={isFavorite ? 'currentColor' : 'none'}
            />
          </button>
        </div>

        <div className="hero-main">

          <div className="hero-icon">
            {codeInfo.icon}
          </div>

          <div className="hero-temp">
            {formatTemperature(
              current.temperature_2m,
              unit
            )}
          </div>

          <div className="hero-meta">

            <p className="hero-condition">
              {codeInfo.label}
            </p>

            <p className="hero-feelslike">
              Feels like{' '}
              {formatTemperature(
                current.apparent_temperature,
                unit
              )}
            </p>

            <p className="hero-highlow">
              H:{' '}
              {formatTemperature(
                daily.temperature_2m_max[0],
                unit
              )}{' '}
              · L:{' '}
              {formatTemperature(
                daily.temperature_2m_min[0],
                unit
              )}
            </p>

          </div>
        </div>

        <p className="hero-message">
          {getHeroMessage(codeInfo.group, isNight)}
        </p>

        <SearchBar
          onSearch={onSearch}
          onUseLocation={onUseLocation}
          locating={locating}
        />

      </div>
    </section>
  )
}

export default CurrentWeather