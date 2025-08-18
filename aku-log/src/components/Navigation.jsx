import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { authService } from '../services/authService'
import { danishTexts } from '../data/danishTexts'
import AccountSettings from './AccountSettings'
import './Navigation.css'

const Navigation = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const t = danishTexts
  const [showAccountSettings, setShowAccountSettings] = useState(false)
  
  // Don't show navigation on login page or patient questionnaire pages
  if (location.pathname === '/login' || location.pathname.includes('/questionnaire/')) {
    return null
  }

  // Don't show if not authenticated
  if (!authService.isAuthenticated()) {
    return null
  }

  const currentUser = authService.getCurrentUser()

  const handleLogout = async () => {
    try {
      await authService.logout()
      navigate('/login')
    } catch (error) {
      console.error('Logout error:', error)
      // Still navigate to login even if logout fails
      navigate('/login')
    }
  }

  return (
    <nav className="navigation">
      <div className="nav-brand">
        <h2 className="app-title">Aku-Log</h2>
      </div>
      <div className="nav-links">
        {currentUser?.role === 'admin' && (
          <Link 
            to={location.pathname.includes('/admin') ? '/overview' : '/admin/questionnaires'} 
            className="nav-link admin-link"
          >
            {location.pathname.includes('/admin') ? 'Oversigt' : 'Admin'}
          </Link>
        )}
        <button 
          onClick={() => setShowAccountSettings(true)}
          className="user-info clickable"
        >
          Velkommen, {currentUser?.name}
        </button>
        <button onClick={handleLogout} className="nav-link logout">
          {t.logout}
        </button>
      </div>
      {showAccountSettings && (
        <AccountSettings onClose={() => setShowAccountSettings(false)} />
      )}
    </nav>
  )
}

export default Navigation
