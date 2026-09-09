const GEOCODING_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const FORECAST_URL = 'https://api.open-meteo.com/v1/forecast'
const REVERSE_GEOCODE_URL =
  'https://api.bigdatacloud.net/data/reverse-geocode-client'

/* =========================================
   TYPES
   ========================================= */

export interface CitySearchResult {
  name: string
  country: string
  admin1: string
  latitude: number
  longitude: number
}

interface GeocodingResponse {
  results?: Array<{
    name: string
    country?: string
    admin1?: string
    latitude: number
    longitude: number
  }>
}

export interface WeatherData {
  current: {
    time: string
    temperature_2m: number
    apparent_temperature: number
    relative_humidity_2m: number
    weathercode: number
    wind_speed_10m: number
    pressure_msl: number
    is_day: number
  }

  hourly: {
    time: string[]
    temperature_2m: number[]
    weathercode: number[]
    precipitation_probability: number[]
    visibility: number[]
  }

  daily: {
    time: string[]
    weathercode: number[]
    temperature_2m_max: number[]
    temperature_2m_min: number[]
    precipitation_probability_max: number[]
    sunrise: string[]
    sunset: string[]
    uv_index_max: number[]
  }
}

interface ReverseGeocodeResponse {
  city?: string
  locality?: string
  countryName?: string
}

export interface ReverseGeocodeResult {
  name: string
  country: string
}

/* =========================================
   SEARCH CITY
   ========================================= */

export async function searchCity(
  query: string
): Promise<CitySearchResult[]> {
  const url = `${GEOCODING_URL}?name=${encodeURIComponent(
    query
  )}&count=5&language=en&format=json`

  const response = await fetch(url)

  if (!response.ok) {
    throw new Error('NETWORK_ERROR')
  }

  const data: GeocodingResponse = await response.json()

  if (!data.results || data.results.length === 0) {
    throw new Error('CITY_NOT_FOUND')
  }

  return data.results.map((place) => ({
    name: place.name,
    country: place.country || '',
    admin1: place.admin1 || '',
    latitude: place.latitude,
    longitude: place.longitude,
  }))
}

/* =========================================
   GET WEATHER BY COORDINATES
   ========================================= */

export async function getWeatherByCoords(
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),

    current: [
      'temperature_2m',
      'apparent_temperature',
      'relative_humidity_2m',
      'weathercode',
      'wind_speed_10m',
      'pressure_msl',
      'is_day',
    ].join(','),

    hourly: [
      'temperature_2m',
      'weathercode',
      'precipitation_probability',
      'visibility',
    ].join(','),

    daily: [
      'weathercode',
      'temperature_2m_max',
      'temperature_2m_min',
      'precipitation_probability_max',
      'sunrise',
      'sunset',
      'uv_index_max',
    ].join(','),

    timezone: 'auto',
    forecast_days: '7',
  })

  const response = await fetch(
    `${FORECAST_URL}?${params.toString()}`
  )

  if (!response.ok) {
    throw new Error('NETWORK_ERROR')
  }

  const data: WeatherData = await response.json()

  return data
}

/* =========================================
   REVERSE GEOCODING
   ========================================= */

export async function reverseGeocode(
  latitude: number,
  longitude: number
): Promise<ReverseGeocodeResult> {
  try {
    const response = await fetch(
      `${REVERSE_GEOCODE_URL}?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
    )

    if (!response.ok) {
      throw new Error('failed')
    }

    const data: ReverseGeocodeResponse = await response.json()

    return {
      name: data.city || data.locality || 'Your Location',
      country: data.countryName || '',
    }
  } catch {
    return {
      name: 'Your Location',
      country: '',
    }
  }
}