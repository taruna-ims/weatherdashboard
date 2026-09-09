import { useEffect, useRef, useState } from 'react'
import { Search, Locate, Loader2 } from 'lucide-react'
import { searchCity } from '../../services/weatherApi'
import './SearchBar.css'

interface CitySuggestion {
  name: string
  country: string
  admin1?: string
  latitude?: number
  longitude?: number
}

interface SearchBarProps {
  onSearch: (city: string) => void
  onUseLocation: () => void
  locating: boolean
}

function SearchBar({
  onSearch,
  onUseLocation,
  locating,
}: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (query.trim().length < 2) {
      setSuggestions([])
      return
    }

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(async () => {
      try {
        const results = await searchCity(query)

        setSuggestions(results)
        setShowSuggestions(true)
      } catch {
        setSuggestions([])
      }
    }, 350)

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [query])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setShowSuggestions(false)
    onSearch(query)
  }

  const handleSuggestionClick = (place: CitySuggestion) => {
    setQuery(place.name)
    setShowSuggestions(false)
    onSearch(place.name)
  }

  return (
    <form
      className="search-bar"
      onSubmit={handleSubmit}
      role="search"
    >
      <div className="search-input-wrapper">
        <Search size={18} className="search-icon" />

        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() =>
            suggestions.length > 0 &&
            setShowSuggestions(true)
          }
          onBlur={() =>
            setTimeout(
              () => setShowSuggestions(false),
              150
            )
          }
          placeholder="Search for a city..."
          aria-label="Search for a city"
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul className="suggestions-list">
            {suggestions.map((place, index) => (
              <li key={`${place.name}-${index}`}>
                <button
                  type="button"
                  onClick={() =>
                    handleSuggestionClick(place)
                  }
                >
                  {place.name}
                  {place.admin1
                    ? `, ${place.admin1}`
                    : ''}{' '}
                  — {place.country}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <button
        type="submit"
        className="search-submit-btn"
      >
        Search
      </button>

      <button
        type="button"
        className="location-btn"
        onClick={onUseLocation}
        disabled={locating}
        aria-label="Use my current location"
      >
        {locating ? (
          <Loader2 size={16} className="spin" />
        ) : (
          <Locate size={16} />
        )}

        <span>Use My Location</span>
      </button>
    </form>
  )
}

export default SearchBar