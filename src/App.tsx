import { useEffect, useMemo, useState, type JSX } from "react";
import Navbar from "./components/Navbar/Navbar";
import CurrentWeather from "./components/CurrentWeather/CurrentWeather";
import WeatherVibe from "./components/WeatherVibe/WeatherVibe";
import WeatherScore from "./components/WeatherScore/WeatherScore";
import HourlyForecast from "./components/HourlyForecast/HourlyForecast";
import WeatherDetails from "./components/WeatherDetails/WeatherDetails";
import DayPlanner from "./components/DayPlanner/DayPlanner";
import DailyForecast from "./components/DailyForecast/DailyForecast";
import UserMode from "./components/UserMode/UserMode";
import FavoriteCities from "./components/FavoriteCities/FavoriteCities";
import Footer from "./components/Footer/Footer";
import Loader from "./components/Loader/Loader";
import ErrorMessage from "./components/ErrorMessage/ErrorMessage";
import { useWeather } from "./hooks/useWeather";
import { THEME_GRADIENTS, getWeatherTheme } from "./utils/weatherUtils";
import "./App.css";

const UNIT_KEY = "skyvibe_unit";
const FAVORITES_KEY = "skyvibe_favorites";
const RECENTS_KEY = "skyvibe_recents";

const MAX_FAVORITES = 5;
const MAX_RECENTS = 5;

type Unit = "C" | "F";

export interface City {
  name: string;
  country: string;
  latitude: number;
  longitude: number;
}

function readFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);

    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function App(): JSX.Element {
  const {
    location,
    weather,
    derived,
    loading,
    locating,
    error,
    setError,
    searchByCity,
    useMyLocation,
    loadCityObject,
  } = useWeather();

  const [unit, setUnit] = useState<Unit>(() =>
    readFromStorage<Unit>(UNIT_KEY, "C"),
  );

  const [favorites, setFavorites] = useState<City[]>(() =>
    readFromStorage<City[]>(FAVORITES_KEY, []),
  );

  const [recents, setRecents] = useState<City[]>(() =>
    readFromStorage<City[]>(RECENTS_KEY, []),
  );

  // Save selected unit
  useEffect(() => {
    localStorage.setItem(UNIT_KEY, JSON.stringify(unit));
  }, [unit]);

  // Save favorite cities
  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
  }, [favorites]);

  // Save recent cities
  useEffect(() => {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(recents));
  }, [recents]);

  // Weather-based gradient theme background
  useEffect(() => {
    if (!derived) return;

    const theme = getWeatherTheme(derived.codeInfo.group, derived.isNight);

    const colors = THEME_GRADIENTS[theme] || THEME_GRADIENTS.sunny;

    document.body.style.setProperty("--bg-gradient-start", colors.start);

    document.body.style.setProperty("--bg-gradient-end", colors.end);
  }, [derived]);

  // Add city to recent searches
  useEffect(() => {
    if (!weather || !location) return;

    setRecents((prev: any) => {
      const withoutDuplicate = prev.filter(
        (city: City) => city.name !== location.name,
      );

      return [location, ...withoutDuplicate].slice(0, MAX_RECENTS);
    });
  }, [weather, location]);

  const toggleUnit = (): void => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  const isFavorite = useMemo<boolean>(
    () =>
      location
        ? favorites.some(
            (city) =>
              city.name === location.name &&
              city.latitude === location.latitude,
          )
        : false,
    [favorites, location],
  );

  const toggleFavorite = (): void => {
    if (!location) return;

    if (isFavorite) {
      setFavorites((prev) =>
        prev.filter((city) => city.name !== location.name),
      );
    } else {
      setFavorites((prev) => [location, ...prev].slice(0, MAX_FAVORITES));
    }
  };

  const removeFavorite = (city: City): void => {
    setFavorites((prev) => prev.filter((item) => item.name !== city.name));
  };

  const scrollToFavorites = (): void => {
    document.getElementById("favorites")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Initial loading
  if (loading && !weather) {
    return <Loader message="Looking at the sky..." />;
  }

  let currentHourIndex = 0;
  let rainChance = 0;
  let visibilityKm = 10;

  if (weather) {
    currentHourIndex = Math.max(
      0,
      weather.hourly.time.findIndex(
        (time: string) => time >= weather.current.time,
      ),
    );

    rainChance =
      weather.hourly.precipitation_probability[currentHourIndex] ?? 0;

    visibilityKm = weather.hourly.visibility
      ? Math.round(weather.hourly.visibility[currentHourIndex] / 1000)
      : 10;
  }

  return (
    <div className="app">
      <Navbar
        unit={unit}
        onToggleUnit={toggleUnit}
        favoritesCount={favorites.length}
        onFavoritesClick={scrollToFavorites}
      />

      {error && <ErrorMessage code={error} onDismiss={() => setError(null)} />}

      {weather && derived && (
        <>
          <CurrentWeather
            location={location}
            current={weather.current}
            daily={weather.daily}
            codeInfo={derived.codeInfo}
            isNight={derived.isNight}
            unit={unit}
            onSearch={searchByCity}
            onUseLocation={useMyLocation}
            locating={locating}
            isFavorite={isFavorite}
            onToggleFavorite={toggleFavorite}
          />

          <WeatherVibe
            temperature={weather.current.temperature_2m}
            group={derived.codeInfo.group}
            rainChance={rainChance}
          />

          <WeatherScore
            temperature={weather.current.temperature_2m}
            rainChance={rainChance}
            windSpeed={weather.current.wind_speed_10m}
            visibilityKm={visibilityKm}
          />

          <HourlyForecast
            hourly={weather.hourly}
            unit={unit}
            currentTime={weather.current.time}
          />

          <WeatherDetails
            current={weather.current}
            daily={weather.daily}
            visibilityKm={visibilityKm}
          />

          <DayPlanner hourly={weather.hourly} unit={unit} />

          <DailyForecast daily={weather.daily} unit={unit} />

          <UserMode
            current={weather.current}
            daily={weather.daily}
            rainChance={rainChance}
          />

          <FavoriteCities
            favorites={favorites}
            recents={recents}
            onSelectCity={loadCityObject}
            onRemoveFavorite={removeFavorite}
          />
        </>
      )}

      <Footer />
    </div>
  );
}

export default App;
