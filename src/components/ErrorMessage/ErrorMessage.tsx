import { AlertTriangle } from 'lucide-react'
import './ErrorMessage.css'

const ERROR_COPY = {
  CITY_NOT_FOUND: "We couldn't find that city. Try another location.",
  NETWORK_ERROR:
    'Unable to fetch weather right now. Please check your connection.',
  LOCATION_DENIED:
    'Location permission was denied. You can still search manually.',
  GEOLOCATION_UNSUPPORTED:
    "Your browser doesn't support location detection. Please search manually.",
  EMPTY_SEARCH:
    'Please type a city name before searching.',
} as const

type ErrorCode = keyof typeof ERROR_COPY

interface ErrorMessageProps {
  code: ErrorCode | string
  onDismiss?: () => void
}

function ErrorMessage({
  code,
  onDismiss,
}: ErrorMessageProps) {
  const text =
    ERROR_COPY[code as ErrorCode] ||
    'Something went wrong. Please try again.'

  return (
    <div className="error-banner" role="alert">
      <AlertTriangle size={18} />

      <span>{text}</span>

      {onDismiss && (
        <button
          className="error-dismiss"
          onClick={onDismiss}
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default ErrorMessage