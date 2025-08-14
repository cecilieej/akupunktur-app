// Firebase Authentication service for the clinic
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  updateProfile
} from 'firebase/auth'
import { auth } from '../config/firebase'

// Define user roles - you can store these in Firestore for more complex role management
const USER_ROLES = {
  'admin@akupunktur.dk': { role: 'admin', name: 'Administrator' },
  'medarbejder1@akupunktur.dk': { role: 'employee', name: 'Demo Medarbejder', employeeId: 'medarbejder1' },
  'marianne@akupunktur.dk': { role: 'employee', name: 'Marianne', employeeId: 'marianne' },
  'karin@akupunktur.dk': { role: 'employee', name: 'Karin', employeeId: 'karin' }
}

export const authService = {
  // Login function
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Get user role from predefined roles or default to 'user'
      const userRole = USER_ROLES[email] || { role: 'employee', name: user.displayName || 'User', employeeId: 'unknown' }
      
      const authData = {
        uid: user.uid,
        email: user.email,
        role: userRole.role,
        name: userRole.name,
        employeeId: userRole.employeeId,
        loginTime: new Date().toISOString()
      }
      
      return authData
    } catch (error) {
      console.error('Login error:', error)
      throw new Error('Ugyldige login oplysninger')
    }
  },

  // Register function (for creating new users)
  async register(email, password, displayName, role = 'user') {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Update the user's profile
      await updateProfile(user, {
        displayName: displayName
      })
      
      return {
        uid: user.uid,
        email: user.email,
        role: role,
        name: displayName,
        loginTime: new Date().toISOString()
      }
    } catch (error) {
      console.error('Registration error:', error)
      throw new Error('Fejl ved oprettelse af bruger')
    }
  },

  // Logout function
  async logout() {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Logout error:', error)
      throw new Error('Fejl ved logout')
    }
  },

  // Check if user is authenticated
  isAuthenticated() {
    return auth.currentUser !== null
  },

  // Get current user
  getCurrentUser() {
    const user = auth.currentUser
    if (!user) return null
    
    const userRole = USER_ROLES[user.email] || { role: 'employee', name: user.displayName || 'User', employeeId: 'unknown' }
    
    return {
      uid: user.uid,
      email: user.email,
      role: userRole.role,
      name: userRole.name,
      employeeId: userRole.employeeId
    }
  },

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser()
    return user && user.role === 'admin'
  },

  // Listen to authentication state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback)
  }
}
