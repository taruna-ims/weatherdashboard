import { useState } from 'react'
import { Plane, PartyPopper, Sprout } from 'lucide-react'
import './UserMode.css'

interface CurrentWeather {
  wind_speed_10m: number
  temperature_2m: number
  relative_humidity_2m: number
}

interface DailyWeather {
  sunrise: string[]
  sunset: string[]
}

interface UserModeProps {
  current: CurrentWeather
  daily: DailyWeather
  rainChance: number
}

type ModeKey = 'traveler' | 'event' | 'farmer'

interface ModeRow {
  label: string
  value: string
}

interface Mode {
  icon: React.ReactNode
  title: string
  recommendation: string
  rows: ModeRow[]
  note?: string
}

function UserMode({
  current,
  daily,
  rainChance,
}: UserModeProps) {
  const [activeMode, setActiveMode] =
    useState<ModeKey>('traveler')

  const windSpeed = Math.round(current.wind_speed_10m)
  const temperature = Math.round(current.temperature_2m)

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

  const modes: Record<ModeKey, Mode> = {
    traveler: {
      icon: <Plane size={18} />,
      title: 'Traveler Mode',
      recommendation:
        rainChance < 30 &&
        temperature >= 18 &&
        temperature <= 32
          ? 'Great weather for sightseeing.'
          : 'Pack for changing conditions before you head out.',
      rows: [
        {
          label: 'Travel comfort',
          value:
            temperature >= 18 && temperature <= 32
              ? 'Comfortable'
              : 'Moderate',
        },
        {
          label: 'Rain possibility',
          value: `${rainChance}%`,
        },
        {
          label: 'Outdoor suitability',
          value:
            rainChance < 40 ? 'Good' : 'Limited',
        },
        {
          label: 'Clothing suggestion',
          value:
            temperature < 18
              ? 'Bring a jacket'
              : 'Light clothing works well',
        },
        {
          label: 'Visibility',
          value: 'Good',
        },
        {
          label: 'Sunrise / Sunset',
          value: `${sunrise} / ${sunset}`,
        },
      ],
    },

    event: {
      icon: <PartyPopper size={18} />,
      title: 'Event Planner Mode',
      recommendation:
        rainChance < 30 && windSpeed < 25
          ? 'Good conditions for an outdoor event today.'
          : 'Consider an indoor backup plan for your event.',
      rows: [
        {
          label: 'Outdoor suitability',
          value:
            rainChance < 30
              ? 'Favorable'
              : 'Risky',
        },
        {
          label: 'Rain risk',
          value: `${rainChance}%`,
        },
        {
          label: 'Wind conditions',
          value: `${windSpeed} km/h`,
        },
        {
          label: 'Temperature comfort',
          value:
            temperature >= 18 && temperature <= 30
              ? 'Comfortable for guests'
              : 'May need shade/heaters',
        },
      ],
    },

    farmer: {
      icon: <Sprout size={18} />,
      title: 'Farmer Mode',
      recommendation:
        rainChance >= 50
          ? 'Rain is likely later today. Consider checking field conditions before planning outdoor work.'
          : 'Dry conditions expected — a reasonable window for outdoor field work.',
      rows: [
        {
          label: 'Temperature',
          value: `${temperature}°C`,
        },
        {
          label: 'Humidity',
          value: `${current.relative_humidity_2m}%`,
        },
        {
          label: 'Rain probability',
          value: `${rainChance}%`,
        },
        {
          label: 'Wind speed',
          value: `${windSpeed} km/h`,
        },
      ],
      note:
        'General weather observation only — not agricultural or crop-treatment advice.',
    },
  }

  const active = modes[activeMode]

  return (
    <section
      id="weather-for-you"
      className="container usermode-section"
    >
      <h2 className="section-title">
        🧭 Weather For You
      </h2>

      <p className="section-subtitle">
        The same forecast, tailored to what you're doing today.
      </p>

      <div
        className="usermode-tabs"
        role="tablist"
      >
        {Object.entries(modes).map(
          ([key, mode]) => (
            <button
              key={key}
              role="tab"
              aria-selected={activeMode === key}
              className={`usermode-tab ${
                activeMode === key ? 'active' : ''
              }`}
              onClick={() =>
                setActiveMode(key as ModeKey)
              }
            >
              {mode.icon}
              {mode.title}
            </button>
          )
        )}
      </div>

      <div className="usermode-card glass-card">
        <p className="usermode-recommendation">
          {active.recommendation}
        </p>

        <div className="usermode-rows">
          {active.rows.map((row) => (
            <div
              className="usermode-row"
              key={row.label}
            >
              <span>{row.label}</span>
              <strong>{row.value}</strong>
            </div>
          ))}
        </div>

        {active.note && (
          <p className="usermode-note">
            {active.note}
          </p>
        )}
      </div>
    </section>
  )
}

export default UserMode