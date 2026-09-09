import { CloudSun } from 'lucide-react'
import './Footer.css'

function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <CloudSun size={20} />
          <span>SkyVibe</span>
        </div>

        {/*
        <p className="footer-tagline">
          Weather that matches your day.
        </p>

        <p className="footer-meta">
          Built with React.js · Weather data by Open-Meteo
        </p>

        <p className="footer-case-study">
          Designed as a React.js Weather Dashboard Case Study.
        </p>
        */}
      </div>
    </footer>
  )
}

export default Footer