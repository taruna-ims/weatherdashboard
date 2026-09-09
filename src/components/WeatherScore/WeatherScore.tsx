import { calculateWeatherScore } from '../../utils/weatherScore'
import './WeatherScore.css'

// Today's Weather Score

interface WeatherScoreProps {
  temperature: number
  rainChance: number
  windSpeed: number
  visibilityKm: number
}

function WeatherScore({
  temperature,
  rainChance,
  windSpeed,
  visibilityKm,
}: WeatherScoreProps) {
  const { score, message } = calculateWeatherScore({
    temperature,
    rainChance,
    windSpeed,
    visibilityKm,
  })

  const radius = 54
  const circumference = 2 * Math.PI * radius
  const progress = (score / 10) * circumference
  const dashOffset = circumference - progress

  return (
    <section className="weather-score-section">
      <div className="container score-container">

        {/* Heading */}
        <div className="score-header">
          <h2 className="section-title">
            🎯 Today's Weather Score
          </h2>

          <p className="section-subtitle">
            A fun convenience score based on temperature, rain,
            wind and visibility — not scientific guidance.
          </p>
        </div>

        {/* Score Card */}
        <div className="score-card glass-card">

          {/* Circular Score */}
          <div className="score-circle-wrapper">
            <svg
              width="140"
              height="140"
              viewBox="0 0 140 140"
              className="score-ring"
              role="img"
              aria-label={`Weather score ${score} out of 10`}
            >
              {/* Background circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="score-ring-bg"
              />

              {/* Progress circle */}
              <circle
                cx="70"
                cy="70"
                r={radius}
                className="score-ring-progress"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
              />

              {/* Score */}
              <text
                x="70"
                y="66"
                textAnchor="middle"
                className="score-ring-value"
              >
                {score}
              </text>

              {/* Out of */}
              <text
                x="70"
                y="86"
                textAnchor="middle"
                className="score-ring-outof"
              >
                / 10
              </text>
            </svg>
          </div>

          {/* Message */}
          <div className="score-content">
            <p className="score-message">
              {message}
            </p>

            <p className="score-description">
              Your weather looks pretty good today!
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}

export default WeatherScore