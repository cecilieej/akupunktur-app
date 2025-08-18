import { useState } from 'react'
import { authService } from '../services/authService'
import './AccountSettings.css'

const AccountSettings = ({ onClose }) => {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const user = authService.getCurrentUser()

  // If user is not loaded yet, show loading
  if (!user) {
    return (
      <div className="account-settings-overlay">
        <div className="account-settings-modal">
          <div className="account-header">
            <h2>Kontoindstillinger</h2>
            <button className="close-btn" onClick={onClose}>×</button>
          </div>
          <div className="account-content">
            <p>Indlæser brugeroplysninger...</p>
          </div>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validation
    if (newPassword.length < 6) {
      setError('Den nye adgangskode skal være mindst 6 tegn lang')
      return
    }

    if (newPassword !== confirmPassword) {
      setError('De nye adgangskoder matcher ikke')
      return
    }

    if (currentPassword === newPassword) {
      setError('Den nye adgangskode skal være anderledes fra den nuværende')
      return
    }

    setIsLoading(true)

    try {
      // Re-authenticate user with current password before updating
      await authService.reauthenticate(currentPassword)
      
      // Update password in Firebase Auth
      await authService.updatePassword(newPassword)
      
      setSuccess('Adgangskode opdateret!')
      
      // Clear form
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      
      // Auto-close after success
      setTimeout(() => {
        onClose()
      }, 2000)
      
    } catch (error) {
      console.error('Error updating password:', error)
      
      // Use the message from our authService which provides better Danish error messages
      setError(error.message || 'Fejl ved opdatering af adgangskode. Prøv igen.')
    } finally {
      setIsLoading(false)
    }
  }

  const getUserDisplayName = () => {
    if (!user || !user.email) return 'Bruger'
    
    const userRoles = {
      'admin@akupunktur.dk': 'Administrator',
      'marianne@akupunktur.dk': 'Marianne',
      'karin@akupunktur.dk': 'Karin',
      'medarbejder1@akupunktur.dk': 'Medarbejder 1'
    }
    return userRoles[user.email] || user.email
  }

  return (
    <div className="account-settings-overlay">
      <div className="account-settings-modal">
        <div className="account-header">
          <h2>Kontoindstillinger</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="account-content">
          <div className="user-info">
            <div className="user-avatar">
              {getUserDisplayName().charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <h3>{getUserDisplayName()}</h3>
              <p>{user?.email || 'Ingen email'}</p>
              <span className="user-role">{user?.role === 'admin' ? 'Administrator' : 'Medarbejder'}</span>
            </div>
          </div>

          <div className="password-section">
            <h3>Skift adgangskode</h3>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="currentPassword">Nuværende adgangskode</label>
                <input
                  type="password"
                  id="currentPassword"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">Ny adgangskode</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Mindst 6 tegn"
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Gentag ny adgangskode</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && <div className="success-message">{success}</div>}

              <div className="form-actions">
                <button type="button" onClick={onClose} className="cancel-btn" disabled={isLoading}>
                  Annuller
                </button>
                <button type="submit" className="save-btn" disabled={isLoading}>
                  {isLoading ? 'Gemmer...' : 'Gem ændringer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AccountSettings
