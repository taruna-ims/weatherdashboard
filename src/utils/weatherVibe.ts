import type { WeatherGroup } from './weatherUtils'

interface WeatherVibeInput {
  temperature: number
  group: WeatherGroup
  rainChance: number
}

export interface WeatherVibe {
  mood: string
  activity: string
  outfit: string
  message: string
}

export function getWeatherVibe({
  temperature,
  group,
  rainChance,
}: WeatherVibeInput): WeatherVibe {
  // Thunderstorm takes priority over everything else
  if (group === 'storm') {
    return {
      mood: 'Cautious ⚡',
      activity: 'Stay indoors, catch up on a show',
      outfit: 'Stay dry, avoid open areas',
      message:
        'Thunderstorms around — best to stay indoors and stay safe.',
    }
  }

  if (group === 'snow') {
    return {
      mood: 'Cosy ❄️',
      activity: 'Hot drinks and indoor games',
      outfit: 'Heavy jacket, gloves, warm boots',
      message:
        'Snowy vibes outside — perfect day to stay warm and cosy.',
    }
  }

  if (group === 'rain' || rainChance >= 50) {
    return {
      mood: 'Cozy ☕',
      activity: 'Indoor café or a good movie',
      outfit: 'Light jacket + umbrella',
      message: 'Looks like a perfect chai-and-movie evening.',
    }
  }

  if (temperature >= 32) {
    return {
      mood: 'Sun-soaked 🔥',
      activity: 'Pool time or a shaded outdoor hangout',
      outfit: 'Light cotton clothes + sunglasses + sunscreen',
      message:
        "It's hot out there — stay hydrated and seek some shade.",
    }
  }

  if (group === 'sunny' && temperature >= 22) {
    return {
      mood: 'Energetic ☀️',
      activity: 'Outdoor walk or a park visit',
      outfit: 'Light clothes + sunglasses',
      message: 'Sunshine is calling — enjoy your day outside!',
    }
  }

  if (temperature <= 15) {
    return {
      mood: 'Chill 🧣',
      activity: 'A warm café or a cosy reading session',
      outfit: 'Sweater or light jacket',
      message:
        'A little chilly today — a warm drink would be perfect.',
    }
  }

  return {
    mood: 'Relaxed 🌤️',
    activity: 'A comfortable walk or casual outing',
    outfit: 'Light layers work well',
    message:
      'A calm, comfortable day — great for whatever you have planned.',
  }
}