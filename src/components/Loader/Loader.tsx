import './Loader.css'

interface LoaderProps {
  message?: string
}

/**
 * A friendly full-page loader shown while the first weather request
 * is in flight, instead of a blank white screen.
 */
function Loader({
  message = "Checking today's weather...",
}: LoaderProps) {
  return (
    <div
      className="loader-wrapper"
      role="status"
      aria-live="polite"
    >
      <div className="loader-icon">🌤️</div>

      <p className="loader-text">{message}</p>

      <div className="loader-skeletons">
        <div className="skeleton-card" />
        <div className="skeleton-card" />
        <div className="skeleton-card" />
      </div>
    </div>
  )
}

export default Loader