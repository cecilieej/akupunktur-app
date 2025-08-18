// Firebase Authentication service for the clinic
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword,
  updateProfile,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

export const authService = {
  // Get user role from Firestore
  async getUserRole(email) {
    try {
      const userRoleDoc = await getDoc(doc(db, 'userRoles', email))
      
      if (userRoleDoc.exists()) {
        const userData = userRoleDoc.data()
        return {
          role: userData.role,
          name: userData.name,
          employeeId: userData.employeeId,
          isActive: userData.isActive !== false // Default to true if not specified
        }
      }
      
      // Default role for unknown users
      return {
        role: 'employee',
        name: 'Unknown User',
        employeeId: 'unknown',
        isActive: false
      }
    } catch (error) {
      console.error('Error fetching user role:', error)
      return {
        role: 'employee',
        name: 'Unknown User',
        employeeId: 'unknown',
        isActive: false
      }
    }
  },
  // Login function
  async login(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user
      
      // Get user role from Firestore
      const userRole = await this.getUserRole(email)
      
      // Check if user is active
      if (!userRole.isActive) {
        await this.logout()
        throw new Error('Din konto er deaktiveret. Kontakt administratoren.')
      }
      
      const authData = {
        uid: user.uid,
        email: user.email,
        role: userRole.role,
        name: userRole.name,
        employeeId: userRole.employeeId,
        loginTime: new Date().toISOString()
      }
      
      // Cache the role data for sync operations
      this.cacheUserRole(email, userRole)
      
      return authData
    } catch (error) {
      console.error('Login error:', error)
      if (error.message.includes('deaktiveret')) {
        throw error // Re-throw custom messages
      }
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

  // Get current user (enhanced with cached data)
  getCurrentUser() {
    const user = auth.currentUser
    if (!user) return null
    
    // Try to get cached role data first
    const cachedRole = localStorage.getItem(`userRole_${user.email}`)
    
    if (cachedRole) {
      const userRole = JSON.parse(cachedRole)
      return {
        uid: user.uid,
        email: user.email,
        role: userRole.role,
        name: userRole.name,
        employeeId: userRole.employeeId
      }
    }
    
    // Fallback if no cached data
    return {
      uid: user.uid,
      email: user.email,
      role: 'employee',
      name: user.displayName || 'User',
      employeeId: 'unknown'
    }
  },

  // Cache user role data
  cacheUserRole(email, roleData) {
    localStorage.setItem(`userRole_${email}`, JSON.stringify(roleData))
  },

  // Clear cached user role data
  clearCachedUserRole(email) {
    localStorage.removeItem(`userRole_${email}`)
  },

  // Logout function
  async logout() {
    try {
      const user = auth.currentUser
      if (user) {
        this.clearCachedUserRole(user.email)
      }
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

  // Check if user is admin
  isAdmin() {
    const user = this.getCurrentUser()
    return user && user.role === 'admin'
  },

  // Listen to authentication state changes
  onAuthStateChanged(callback) {
    return onAuthStateChanged(auth, callback)
  },

  // Re-authenticate user with current password (required for sensitive operations)
  async reauthenticate(currentPassword) {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('Ingen bruger er logget ind')
      }
      
      const credential = EmailAuthProvider.credential(user.email, currentPassword)
      await reauthenticateWithCredential(user, credential)
      return true
    } catch (error) {
      console.error('Re-authentication error:', error)
      if (error.code === 'auth/wrong-password' || error.code === 'auth/invalid-credential') {
        throw new Error('Forkert nuværende adgangskode')
      }
      if (error.code === 'auth/too-many-requests') {
        throw new Error('For mange forsøg. Prøv igen senere.')
      }
      if (error.code === 'auth/user-mismatch') {
        throw new Error('Bruger matcher ikke')
      }
      throw new Error('Fejl ved bekræftelse af identitet')
    }
  },

  // Update user password
  async updatePassword(newPassword) {
    try {
      const user = auth.currentUser
      if (!user) {
        throw new Error('Ingen bruger er logget ind')
      }
      
      await updatePassword(user, newPassword)
      return true
    } catch (error) {
      console.error('Password update error:', error)
      if (error.code === 'auth/requires-recent-login') {
        throw new Error('Du skal bekræfte din identitet før du kan ændre adgangskode')
      }
      if (error.code === 'auth/weak-password') {
        throw new Error('Adgangskoden er for svag')
      }
      throw new Error('Fejl ved opdatering af adgangskode')
    }
  }
}
