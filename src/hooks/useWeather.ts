import { useCallback, useEffect, useState } from "react";

import {
  searchCity,
  getWeatherByCoords,
  reverseGeocode,
} from "../services/weatherApi";

import { describeWeatherCode, isNightTime } from "../utils/weatherUtils";

const DEFAULT_CITY: City = {
  name: "New Delhi",
  country: "India",
  latitude: 28.6139,
  longitude: 77.209,
};

interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

interface WeatherCurrent {
  time: string;
  temperature_2m: number;
  apparent_temperature: number;
  weathercode: number;
  relative_humidity_2m: number;
  wind_speed_10m: number;
  pressure_msl: number;
}

interface WeatherDaily {
  sunrise: string[];
  sunset: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  uv_index_max: number[];
}

interface WeatherHourly {
  time: string[];
  weathercode: number[];
  temperature_2m: number[];
  precipitation_probability: number[];
  visibility: number[];
}

interface WeatherData {
  current: WeatherCurrent;
  daily: WeatherDaily;
  hourly: WeatherHourly;
  [key: string]: unknown;
}

interface DerivedWeather {
  codeInfo: ReturnType<typeof describeWeatherCode>;
  isNight: boolean;
}

type WeatherError =
  | "CITY_NOT_FOUND"
  | "NETWORK_ERROR"
  | "EMPTY_SEARCH"
  | "LOCATION_DENIED"
  | "GEOLOCATION_UNSUPPORTED";

export function useWeather() {
  const [location, setLocation] = useState<City>(DEFAULT_CITY);

  const [weather, setWeather] = useState<WeatherData | null>(null);

  const [loading, setLoading] = useState<boolean>(true);

  const [error, setError] = useState<WeatherError | null>(null);

  const [locating, setLocating] = useState<boolean>(false);

  const fetchWeatherForLocation = useCallback(
    async (place: City): Promise<void> => {
      setLoading(true);
      setError(null);

      try {
        const data = await getWeatherByCoords(place.latitude, place.longitude);

        setWeather(data as unknown as WeatherData);
        setLocation(place);
      } catch (err) {
        console.error(err);
        setError("NETWORK_ERROR");
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  // Load the default city on first render
  useEffect(() => {
    fetchWeatherForLocation(DEFAULT_CITY);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const searchByCity = useCallback(
    async (cityName: string): Promise<City | undefined> => {
      const trimmed = cityName.trim();

      if (!trimmed) {
        setError("EMPTY_SEARCH");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const results = await searchCity(trimmed);

        const best = results[0];

        if (!best) {
          throw new Error("CITY_NOT_FOUND");
        }

        const place: City = {
          name: best.name,
          country: best.country,
          latitude: best.latitude,
          longitude: best.longitude,
        };

        await fetchWeatherForLocation(place);

        return best;
      } catch (err: unknown) {
        console.error(err);

        if (err instanceof Error && err.message === "CITY_NOT_FOUND") {
          setError("CITY_NOT_FOUND");
        } else {
          setError("NETWORK_ERROR");
        }

        setLoading(false);
      }
    },
    [fetchWeatherForLocation],
  );

  const useMyLocation = useCallback((): void => {
    if (!navigator.geolocation) {
      setError("GEOLOCATION_UNSUPPORTED");
      return;
    }

    setLocating(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;

          const place = await reverseGeocode(latitude, longitude);

          await fetchWeatherForLocation({
            ...place,
            latitude,
            longitude,
          });
        } catch (err) {
          console.error(err);
          setError("NETWORK_ERROR");
        } finally {
          setLocating(false);
        }
      },
      () => {
        setError("LOCATION_DENIED");
        setLocating(false);
      },
      {
        timeout: 10000,
      },
    );
  }, [fetchWeatherForLocation]);

  // Derived, easy-to-use values built from the raw API response
  let derived: DerivedWeather | null = null;

  if (weather) {
    const { current, daily } = weather;

    const codeInfo = describeWeatherCode(current.weathercode);

    const night = isNightTime(current.time, daily.sunrise[0], daily.sunset[0]);

    derived = {
      codeInfo,
      isNight: night,
    };
  }

  return {
    location,
    weather,
    derived,
    loading,
    locating,
    error,
    setError,
    searchByCity,
    useMyLocation,
    loadCityObject: fetchWeatherForLocation,
  };
}
