// Simple authentication service for the clinic
// In a real production app, you'd use Firebase Auth, but this is a simple demo system

const USERS = {
  admin: {
    username: 'admin',
    password: '1234',
    role: 'admin',
    name: 'Administrator'
  },
  user1: {
    username: 'medarbejder1',
    password: 'pass1',
    role: 'user',
    name: 'Medarbejder 1'
  },
  user2: {
    username: 'medarbejder2',
    password: 'pass2',
    role: 'user',
    name: 'Medarbejder 2'
  },
  user3: {
    username: 'medarbejder3',
    password: 'pass3',
    role: 'user',
    name: 'Medarbejder 3'
  }
}

export const authService = {
  // Login function
  login(username, password) {
    const user = Object.values(USERS).find(
      u => u.username === username && u.password === password
    )
    
    if (user) {
      const authData = {
        username: user.username,
        role: user.role,
        name: user.name,
        loginTime: new Date().toISOString()
      }
      
      // Store in localStorage
      localStorage.setItem('akupunktur-auth', JSON.stringify(authData))
      return authData
    }
    
    throw new Error('Ugyldige login oplysninger')
  },

  // Logout function
  logout() {
    localStorage.removeItem('akupunktur-auth')
  },

  // Check if user is authenticated
  isAuthenticated() {
    const authData = localStorage.getItem('akupunktur-auth')
    return authData !== null
  },

  // Get current user
  getCurrentUser() {
    const authData = localStorage.getItem('akupunktur-auth')
    return authData ? JSON.parse(authData) : null
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser()
    return user && user.role === 'admin'
  }
}
