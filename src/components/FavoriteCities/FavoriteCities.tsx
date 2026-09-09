import { Heart, X, Clock } from "lucide-react";
import "./FavoriteCities.css";
import type { City } from "../../App";

interface FavoriteCitiesProps {
  favorites: City[];
  recents: City[];
  onSelectCity: (city: City) => void;
  onRemoveFavorite: (city: City) => void;
}

function FavoriteCities({
  favorites,
  recents,
  onSelectCity,
  onRemoveFavorite,
}: FavoriteCitiesProps) {
  return (
    <section id="favorites" className="container favorites-section">
      <h2 className="section-title">
        <Heart size={20} /> Favorite Cities
      </h2>

      {favorites.length === 0 ? (
        <p className="favorites-empty">
          No favorites yet — tap the heart on any city's weather to save it here
          (up to 5).
        </p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((city) => (
            <div
              className="favorite-chip glass-card"
              key={`${city.name}-${city.latitude}`}
            >
              <button
                className="favorite-chip-main"
                onClick={() => onSelectCity(city)}
              >
                {city.name}
                {city.country ? `, ${city.country}` : ""}
              </button>

              <button
                className="favorite-chip-remove"
                onClick={() => onRemoveFavorite(city)}
                aria-label={`Remove ${city.name} from favorites`}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}

      {recents.length > 0 && (
        <div className="recents-block">
          <p className="recents-title">
            <Clock size={15} /> Recent Searches
          </p>

          <div className="recents-list">
            {recents.map((city) => (
              <button
                key={`${city.name}-${city.latitude}`}
                className="recent-chip"
                onClick={() => onSelectCity(city)}
              >
                {city.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}

export default FavoriteCities;
