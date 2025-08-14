import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services/authService'
import { danishTexts } from '../data/danishTexts'
import './Login.css'

const Login = () => {
  const navigate = useNavigate()
  const t = danishTexts
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    
    try {
      await authService.login(credentials.email, credentials.password)
      navigate('/overview')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    })
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>{t.employeeLogin}</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={credentials.email}
              onChange={handleChange}
              placeholder="eks. demo@akupunktur.dk"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">{t.password}</label>
            <input
              type="password"
              id="password"
              name="password"
              value={credentials.password}
              onChange={handleChange}
              required
            />
          </div>
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logger ind...' : t.login}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login
