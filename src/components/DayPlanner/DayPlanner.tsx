import { describeWeatherCode, formatTemperature } from '../../utils/weatherUtils'
import { Droplets } from 'lucide-react'
import './DayPlanner.css'

interface HourlyWeather {
  time: string[]
  weathercode: number[]
  precipitation_probability: number[]
  temperature_2m: number[]
}

interface DayPlannerProps {
  hourly: HourlyWeather
  unit: 'C' | 'F'
}

const BLOCKS = [
  { label: 'Morning', hour: 8, icon: '🌅' },
  { label: 'Afternoon', hour: 14, icon: '🔥' },
  { label: 'Evening', hour: 18, icon: '🌤️' },
  { label: 'Night', hour: 22, icon: '🌙' },
]

function getRecommendation(
  rainChance: number,
  temperature: number
): string {
  if (rainChance >= 50) return 'Carry an umbrella'
  if (temperature >= 32) return 'Stay hydrated'
  if (temperature <= 15) return 'Wear something warm'
  return 'Great time to head outside'
}

function DayPlanner({ hourly, unit }: DayPlannerProps) {
  // hourly.time looks like "2026-09-06T08:00"
  const todayPrefix = hourly.time[0].split('T')[0]

  return (
    <section className="container planner-section">
      <h2 className="section-title">🗓️ Plan Your Day</h2>

      <p className="section-subtitle">
        A quick look at how today unfolds.
      </p>

      <div className="planner-scroll">
        {BLOCKS.map((block) => {
          const target = `${todayPrefix}T${String(block.hour).padStart(
            2,
            '0'
          )}:00`

          let index = hourly.time.indexOf(target)

          if (index === -1) {
            index = 0
          }

          const codeInfo = describeWeatherCode(
            hourly.weathercode[index]
          )

          const rainChance =
            hourly.precipitation_probability[index] ?? 0

          const temperature =
            hourly.temperature_2m[index] ?? 0

          return (
            <div
              className="planner-card glass-card"
              key={block.label}
            >
              <p className="planner-label">
                {block.icon} {block.label}
              </p>

              <p className="planner-temp">
                {formatTemperature(temperature, unit)}
              </p>

              <p className="planner-condition">
                {codeInfo.label}
              </p>

              <p className="planner-rain">
                <Droplets size={13} /> {rainChance}%
              </p>

              <p className="planner-tip">
                {getRecommendation(
                  rainChance,
                  temperature
                )}
              </p>
            </div>
          )
        })}
      </div>
    </section>
  )
}

export default DayPlanner