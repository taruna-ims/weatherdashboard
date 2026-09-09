import type { ReactNode } from 'react'
import { Smile, Activity, Shirt, MessageCircle } from 'lucide-react'
import { getWeatherVibe } from '../../utils/weatherVibe'
import './WeatherVibe.css'
import type { WeatherGroup } from '../../utils/weatherUtils'

type WeatherVibeProps = {
  temperature: number
  group: WeatherGroup
  rainChance: number
}

type VibeItem = {
  icon: ReactNode
  label: string
  value: string
}

function WeatherVibe({
  temperature,
  group,
  rainChance,
}: WeatherVibeProps) {
  const vibe = getWeatherVibe({
    temperature,
    group,
    rainChance,
  })

  const items: VibeItem[] = [
    {
      icon: <Smile size={20} />,
      label: 'Mood',
      value: vibe.mood,
    },
    {
      icon: <Activity size={20} />,
      label: 'Activity',
      value: vibe.activity,
    },
    {
      icon: <Shirt size={20} />,
      label: 'Outfit',
      value: vibe.outfit,
    },
  ]

  return (
    <section className="container vibe-section">
      <h2 className="section-title">✨ Weather Vibe</h2>

      <p className="section-subtitle">
        Today's mood, matched to the sky.
      </p>

      <div className="vibe-card glass-card">
        <div className="vibe-grid">
          {items.map((item) => (
            <div className="vibe-item" key={item.label}>
              <span className="vibe-icon">
                {item.icon}
              </span>

              <div>
                <p className="vibe-label">
                  {item.label}
                </p>

                <p className="vibe-value">
                  {item.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="vibe-message">
          <MessageCircle size={18} />
          <p>{vibe.message}</p>
        </div>
      </div>
    </section>
  )
}

export default WeatherVibe