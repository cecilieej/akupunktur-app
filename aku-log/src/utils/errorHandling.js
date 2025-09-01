// Authentication and Firebase error handling utilities
import { authService } from '../services/authService'

/**
 * Standard error messages in Danish for Firebase errors
 */
export const errorMessages = {
  'permission-denied': 'Du har ikke tilladelse til denne handling. Kontakt din administrator.',
  'unauthenticated': 'Du skal logge ind igen for at fortsætte.',
  'unavailable': 'Databasen er midlertidigt utilgængelig. Prøv igen om et øjeblik.',
  'not-found': 'Den anmodede ressource blev ikke fundet.',
  'already-exists': 'Denne ressource eksisterer allerede.',
  'invalid-argument': 'Ugyldig data blev sendt. Kontrollér dine indtastninger.',
  'resource-exhausted': 'For mange anmodninger. Vent et øjeblik og prøv igen.',
  'failed-precondition': 'Handlingen kan ikke udføres på nuværende tidspunkt.',
  'aborted': 'Handlingen blev afbrudt. Prøv igen.',
  'out-of-range': 'Data er uden for det tilladte område.',
  'unimplemented': 'Denne funktion er ikke implementeret endnu.',
  'internal': 'Der opstod en intern serverfejl. Kontakt support.',
  'deadline-exceeded': 'Anmodningen tog for lang tid. Prøv igen.',
  'data-loss': 'Datatab registreret. Kontakt support øjeblikkeligt.',
  'unknown': 'En ukendt fejl opstod. Kontakt support.',
  'network': 'Internetforbindelsen er ustabil. Kontrollér din forbindelse og prøv igen.',
  'default': 'Der opstod en fejl. Prøv igen eller kontakt support.'
}

/**
 * Handle Firebase authentication and permission errors
 * @param {Error} error - The error object from Firebase
 * @param {Function} setError - Function to set error state in component
 * @param {Function} navigate - Navigation function (optional, for redirects)
 * @returns {string} The error message
 */
export const handleFirebaseError = (error, setError = null, navigate = null) => {
  console.error('Firebase error:', error)
  
  let errorMessage = errorMessages.default
  
  // Handle specific Firebase error codes
  if (error.code) {
    errorMessage = errorMessages[error.code] || errorMessages.default
  } else if (error.message) {
    // Check for common network errors
    if (error.message.includes('network') || error.message.includes('fetch')) {
      errorMessage = errorMessages.network
    } else if (error.message.includes('permission')) {
      errorMessage = errorMessages['permission-denied']
    }
  }
  
  // Handle authentication errors with automatic logout
  if (error.code === 'unauthenticated') {
    authService.logout()
    if (navigate) {
      navigate('/login')
    } else {
      window.location.href = '/login'
    }
  }
  
  // Set error in component if function provided
  if (setError) {
    setError(errorMessage)
  }
  
  return errorMessage
}

/**
 * Handle errors for alert dialogs (simpler version)
 * @param {Error} error - The error object
 * @returns {string} The error message for alert
 */
export const handleErrorForAlert = (error) => {
  console.error('Error for alert:', error)
  
  if (error.code === 'permission-denied') {
    return 'Du har ikke tilladelse til denne handling. Kontakt din administrator.'
  } else if (error.code === 'unauthenticated') {
    // Handle logout for alert scenarios
    authService.logout()
    window.location.href = '/login'
    return 'Du skal logge ind igen for at fortsætte.'
  } else if (error.code === 'unavailable') {
    return 'Databasen er midlertidigt utilgængelig. Prøv igen om et øjeblik.'
  } else if (error.message && error.message.includes('network')) {
    return 'Internetforbindelsen er ustabil. Kontrollér din forbindelse og prøv igen.'
  }
  
  return 'Der opstod en fejl. Prøv igen.'
}

/**
 * Wrapper function for async operations with error handling
 * @param {Function} operation - The async operation to execute
 * @param {Function} setError - Function to set error state
 * @param {Function} setLoading - Function to set loading state (optional)
 * @param {Function} navigate - Navigation function (optional)
 */
export const executeWithErrorHandling = async (operation, setError, setLoading = null, navigate = null) => {
  try {
    if (setLoading) setLoading(true)
    if (setError) setError('')
    
    await operation()
  } catch (error) {
    handleFirebaseError(error, setError, navigate)
  } finally {
    if (setLoading) setLoading(false)
  }
}

/**
 * Check if user has permission for an operation
 * @param {Object} user - Current user object
 * @param {string} operation - Operation name ('read', 'write', 'delete', 'admin')
 * @param {Object} resource - Resource object (optional, for ownership checks)
 * @returns {boolean} Whether user has permission
 */
export const hasPermission = (user, operation, resource = null) => {
  if (!user || !user.isActive) {
    return false
  }
  
  // Admin users can do everything
  if (user.role === 'admin') {
    return true
  }
  
  // Employee permissions
  if (user.role === 'employee') {
    switch (operation) {
      case 'read':
        // Employees can read their own assigned resources
        return !resource || !resource.assignedTo || resource.assignedTo === user.employeeId
      case 'write':
        // Employees can write to their own assigned resources
        return !resource || !resource.assignedTo || resource.assignedTo === user.employeeId
      case 'delete':
        // Employees generally cannot delete (except their own notes)
        return false
      case 'admin':
        // Employees cannot perform admin operations
        return false
      default:
        return false
    }
  }
  
  return false
}
