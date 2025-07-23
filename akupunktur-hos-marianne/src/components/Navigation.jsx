import { Link, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../data/translations'
import './Navigation.css'

const Navigation = () => {
  const location = useLocation()
  const { language, toggleLanguage } = useLanguage()
  const t = translations[language]
  
  // Don't show navigation on login page or questionnaire page
  if (location.pathname === '/login' || location.pathname.startsWith('/questionnaire')) {
    return null
  }

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>Akupunktur hos Marianne</h2>
      </div>
      <div className="nav-links">
        <button 
          onClick={toggleLanguage}
          className="language-toggle"
          aria-label="Toggle language"
        >
          {t.toggleLanguage}
        </button>
        <Link to="/login" className="nav-link logout">
          {t.logout}
        </Link>
      </div>
    </nav>
  )
}

export default Navigation
