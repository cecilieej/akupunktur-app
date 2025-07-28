import { Link, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { danishTexts } from '../data/danishTexts'
import './Navigation.css'

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const t = danishTexts
  
  // Don't show navigation on login page or patient questionnaire pages
  if (location.pathname === '/login' || location.pathname.includes('/questionnaire/')) {
    return null
  }

  // Don't show if not authenticated
  if (!authService.isAuthenticated()) {
    return null
  }

  const currentUser = authService.getCurrentUser()

  const handleLogout = () => {
    authService.logout()
    navigate('/login')
  }

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2>Akupunktur hos Marianne</h2>
      </div>
      <div className="nav-links">
        <span className="user-info">
          Velkommen, {currentUser?.name}
        </span>
        <button onClick={handleLogout} className="nav-link logout">
          {t.logout}
        </button>
      </div>
    </nav>
  )
}

export default Navigation
