interface WeatherScoreInput {
  temperature: number
  rainChance: number
  windSpeed: number
  visibilityKm?: number
}

interface WeatherScoreResult {
  score: number
  message: string
}

export function calculateWeatherScore({
  temperature,
  rainChance,
  windSpeed,
  visibilityKm,
}: WeatherScoreInput): WeatherScoreResult {
  let score = 10

  // Temperature comfort: ideal range roughly 18-28°C
  if (temperature < 10 || temperature > 36) {
    score -= 3
  } else if (temperature < 18 || temperature > 30) {
    score -= 1.5
  }

  // Rain probability
  if (rainChance >= 70) score -= 3
  else if (rainChance >= 40) score -= 1.5
  else if (rainChance >= 20) score -= 0.5

  // Wind speed (km/h)
  if (windSpeed >= 40) score -= 2
  else if (windSpeed >= 25) score -= 1

  // Visibility (km)
  if (visibilityKm !== undefined) {
    if (visibilityKm < 2) score -= 2
    else if (visibilityKm < 5) score -= 1
  }

  score = Math.max(0, Math.min(10, score))

  const rounded = Math.round(score * 10) / 10

  let message = 'Great day to be outside!'

  if (rounded < 4) {
    message = 'Better suited for indoor plans today.'
  } else if (rounded < 6.5) {
    message = 'A decent day — plan around the weather a bit.'
  } else if (rounded < 8.5) {
    message = 'Pretty pleasant conditions overall.'
  }

  return {
    score: rounded,
    message,
  }
}