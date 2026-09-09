import { useState } from 'react'
import { CloudSun, Menu, X, Heart } from 'lucide-react'
import './Navbar.css'

interface NavbarProps {
  unit: 'C' | 'F'
  onToggleUnit: () => void
  favoritesCount: number
  onFavoritesClick: () => void
}

export default function Navbar({
  unit,
  onToggleUnit,
  favoritesCount,
  onFavoritesClick,
}: NavbarProps) {
  const [menuOpen, setMenuOpen] = useState(false)

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: 'smooth',
    })

    setMenuOpen(false)
  }

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <div className="navbar-brand">
          <CloudSun size={26} />
          <span>SkyVibe</span>
        </div>

        <nav className={`navbar-links ${menuOpen ? 'open' : ''}`}>
          <button onClick={() => scrollTo('weather')}>
            Weather
          </button>

          <button onClick={() => scrollTo('forecast')}>
            Forecast
          </button>

          <button onClick={() => scrollTo('weather-for-you')}>
            Weather For You
          </button>
        </nav>

        <div className="navbar-actions">
          <button
            className="unit-toggle"
            onClick={onToggleUnit}
            aria-label="Toggle temperature unit"
          >
            <span className={unit === 'C' ? 'active' : ''}>
              °C
            </span>

            <span className="unit-divider">/</span>

            <span className={unit === 'F' ? 'active' : ''}>
              °F
            </span>
          </button>

          <button
            className="favorites-btn"
            onClick={onFavoritesClick}
            aria-label="View favorite cities"
          >
            <Heart
              size={18}
              fill={favoritesCount > 0 ? 'currentColor' : 'none'}
            />

            {favoritesCount > 0 && (
              <span className="favorites-count">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            className="menu-toggle"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
          >
            {menuOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}
          </button>
        </div>
      </div>
    </header>
  )
}

