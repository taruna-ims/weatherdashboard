// Reference: https://open-meteo.com/en/docs
// WMO Weather interpretation codes

export type WeatherGroup =
  | 'sunny'
  | 'cloudy'
  | 'rain'
  | 'snow'
  | 'storm'

export type WeatherTheme = WeatherGroup | 'night'

export type WeatherCodeInfo = {
  label: string
  icon: string
  group: WeatherGroup
}

const WEATHER_CODE_MAP: Record<number, WeatherCodeInfo> = {
  0: { label: 'Clear Sky', icon: '☀️', group: 'sunny' },
  1: { label: 'Mostly Clear', icon: '🌤️', group: 'sunny' },
  2: { label: 'Partly Cloudy', icon: '⛅', group: 'cloudy' },
  3: { label: 'Overcast', icon: '☁️', group: 'cloudy' },
  45: { label: 'Foggy', icon: '🌫️', group: 'cloudy' },
  48: { label: 'Icy Fog', icon: '🌫️', group: 'cloudy' },
  51: { label: 'Light Drizzle', icon: '🌦️', group: 'rain' },
  53: { label: 'Drizzle', icon: '🌦️', group: 'rain' },
  55: { label: 'Heavy Drizzle', icon: '🌧️', group: 'rain' },
  56: { label: 'Freezing Drizzle', icon: '🌧️', group: 'rain' },
  57: { label: 'Freezing Drizzle', icon: '🌧️', group: 'rain' },
  61: { label: 'Light Rain', icon: '🌦️', group: 'rain' },
  63: { label: 'Rain', icon: '🌧️', group: 'rain' },
  65: { label: 'Heavy Rain', icon: '🌧️', group: 'rain' },
  66: { label: 'Freezing Rain', icon: '🌧️', group: 'rain' },
  67: { label: 'Freezing Rain', icon: '🌧️', group: 'rain' },
  71: { label: 'Light Snow', icon: '🌨️', group: 'snow' },
  73: { label: 'Snow', icon: '❄️', group: 'snow' },
  75: { label: 'Heavy Snow', icon: '❄️', group: 'snow' },
  77: { label: 'Snow Grains', icon: '❄️', group: 'snow' },
  80: { label: 'Light Showers', icon: '🌦️', group: 'rain' },
  81: { label: 'Showers', icon: '🌧️', group: 'rain' },
  82: { label: 'Heavy Showers', icon: '🌧️', group: 'rain' },
  85: { label: 'Snow Showers', icon: '🌨️', group: 'snow' },
  86: { label: 'Heavy Snow Showers', icon: '❄️', group: 'snow' },
  95: { label: 'Thunderstorm', icon: '⛈️', group: 'storm' },
  96: { label: 'Thunderstorm + Hail', icon: '⛈️', group: 'storm' },
  99: { label: 'Severe Thunderstorm', icon: '⛈️', group: 'storm' },
}

export function describeWeatherCode(code: number): WeatherCodeInfo {
  return (
    WEATHER_CODE_MAP[code] || {
      label: 'Unknown',
      icon: '🌡️',
      group: 'cloudy',
    }
  )
}

export function getWeatherTheme(
  group: WeatherGroup,
  isNight: boolean
): WeatherTheme {
  if (isNight) return 'night'
  return group
}

export interface ThemeGradient {
  start: string
  end: string
  endRightUp?: string
}

export const THEME_GRADIENTS: Record<WeatherTheme, ThemeGradient> = {
  sunny: {
    start: '#2caffe',
    endRightUp: '#ffd56b',
    end: '#ffd56b',
  },
  cloudy: {
    start: '#8e9eab',
    end: '#5c6f82',
  },
  rain: {
    start: '#3a6186',
    end: '#2b5876',
  },
  snow: {
    start: '#8fb8e0',
    end: '#c9d6e3',
  },
  storm: {
    start: '#232526',
    end: '#414345',
  },
  night: {
    start: '#0f2027',
    end: '#203a43',
  },
}

/** Celsius → Fahrenheit */
export function toFahrenheit(celsius: number): number {
  return Math.round((celsius * 9) / 5 + 32)
}

/** Formats a temperature number */
export function formatTemperature(
  celsius: number | null | undefined,
  unit: 'C' | 'F'
): string {
  if (celsius === null || celsius === undefined) {
    return '--'
  }

  const value =
    unit === 'F' ? toFahrenheit(celsius) : Math.round(celsius)

  return `${value}°`
}

/** "2026-09-06T14:00" → "2 PM" */
export function formatHour(isoString: string): string {
  const date = new Date(isoString)

  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true,
  })
}

/** "2026-09-06" → "Sun" */
export function formatWeekday(isoDateString: string): string {
  const date = new Date(`${isoDateString}T00:00:00`)

  return date.toLocaleDateString('en-US', {
    weekday: 'short',
  })
}

/** Current date */
export function formatFullDate(date: Date = new Date()): string {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
}

/** Formatted current time */
export function formatTime(date: Date = new Date()): string {
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  })
}

/** Determines whether the given time is night */
export function isNightTime(
  nowIso: string,
  sunriseIso: string,
  sunsetIso: string
): boolean {
  const now = new Date(nowIso).getTime()
  const sunrise = new Date(sunriseIso).getTime()
  const sunset = new Date(sunsetIso).getTime()

  return now < sunrise || now > sunset
}

/** Weather message for the hero section */
export function getHeroMessage(
  group: WeatherGroup,
  isNight: boolean
): string {
  if (isNight) {
    return 'A calm night ahead — perfect for winding down. 🌙'
  }

  switch (group) {
    case 'sunny':
      return 'Perfect weather for an evening walk 🌤️'

    case 'rain':
      return 'Grab an umbrella before heading out ☔'

    case 'snow':
      return 'Bundle up, it looks chilly out there ❄️'

    case 'storm':
      return 'Best to stay indoors during the storm ⛈️'

    default:
      return 'A calm, comfortable day overall ⛅'
  }
}