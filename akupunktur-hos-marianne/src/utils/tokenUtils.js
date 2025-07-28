// Utility functions for questionnaire token management

// Generate a secure random token
export function generateAccessToken() {
  const array = new Uint8Array(32)
  crypto.getRandomValues(array)
  return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
}

// Generate expiry date (default 30 days from now)
export function generateExpiryDate(daysFromNow = 30) {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString()
}

// Check if token is expired
export function isTokenExpired(expiryDate) {
  return new Date() > new Date(expiryDate)
}

// Generate questionnaire URL
export function generateQuestionnaireUrl(patientId, questionnaireId, token) {
  const baseUrl = window.location.origin
  return `${baseUrl}/questionnaire/${patientId}/${questionnaireId}/${token}`
}

// Validate questionnaire access
export function validateQuestionnaireAccess(questionnaire) {
  if (!questionnaire) {
    throw new Error('Spørgeskema ikke fundet')
  }
  
  if (questionnaire.status === 'completed') {
    throw new Error('Dette spørgeskema er allerede udfyldt')
  }
  
  if (isTokenExpired(questionnaire.expiryDate)) {
    throw new Error('Dette link er udløbet. Kontakt klinikken for et nyt link.')
  }
  
  return true
}
