# Authentication Error Handling Documentation

## Overview
This application includes comprehensive authentication error handling for Firebase operations, providing user-friendly Danish error messages and appropriate fallback actions.

## Key Features

### 1. Centralized Error Handling
- **File**: `src/utils/errorHandling.js`
- **Purpose**: Standardized error handling across all components
- **Languages**: All error messages are in Danish for clinical staff

### 2. Error Types Handled

#### Firebase Authentication Errors
- `permission-denied`: No permission for operation
- `unauthenticated`: User needs to log in again
- `unavailable`: Database temporarily unavailable
- `not-found`: Resource not found
- `already-exists`: Resource already exists
- `invalid-argument`: Invalid data provided

#### Network and General Errors
- Network connectivity issues
- Unknown errors with fallback messages
- Database timeout and performance issues

### 3. Error Response Actions

#### Automatic Logout
- Triggered on `unauthenticated` errors
- Clears user session and redirects to login
- Prevents continued operations with invalid credentials

#### User-Friendly Messages
- All technical error codes translated to Danish
- Clear instructions for users on next steps
- Contact information for support when needed

## Implementation

### Components Updated
1. **Overview.jsx**: Patient data operations
2. **PatientInfo.jsx**: Patient details and notes
3. **QuestionnaireManager.jsx**: Admin questionnaire operations
4. **Login.jsx**: Authentication flow
5. **AccountSettings.jsx**: Password management

### Error Handling Functions

#### `handleFirebaseError(error, setError, navigate)`
- **Purpose**: Main error handler for component state
- **Parameters**:
  - `error`: Firebase error object
  - `setError`: Component error state setter
  - `navigate`: Optional navigation function
- **Returns**: Error message string

#### `handleErrorForAlert(error)`
- **Purpose**: Error handler for alert dialogs
- **Parameters**: `error`: Firebase error object
- **Returns**: Danish error message for alert

#### `executeWithErrorHandling(operation, setError, setLoading, navigate)`
- **Purpose**: Wrapper for async operations
- **Parameters**:
  - `operation`: Async function to execute
  - `setError`: Error state setter
  - `setLoading`: Loading state setter (optional)
  - `navigate`: Navigation function (optional)

#### `hasPermission(user, operation, resource)`
- **Purpose**: Check user permissions before operations
- **Parameters**:
  - `user`: Current user object
  - `operation`: Type of operation ('read', 'write', 'delete', 'admin')
  - `resource`: Resource object for ownership checks
- **Returns**: Boolean permission result

## Error Messages (Danish)

### Authentication Errors
- **Permission Denied**: "Du har ikke tilladelse til denne handling. Kontakt din administrator."
- **Unauthenticated**: "Du skal logge ind igen for at fortsætte."
- **Unavailable**: "Databasen er midlertidigt utilgængelig. Prøv igen om et øjeblik."

### Network Errors
- **Network Issues**: "Internetforbindelsen er ustabil. Kontrollér din forbindelse og prøv igen."
- **Timeout**: "Anmodningen tog for lang tid. Prøv igen."

### General Errors
- **Default**: "Der opstod en fejl. Prøv igen eller kontakt support."
- **Not Found**: "Den anmodede ressource blev ikke fundet."
- **Already Exists**: "Denne ressource eksisterer allerede."

## Security Features

### Role-Based Access Control
- Admin users: Full access to all operations
- Employee users: Limited to assigned patients only
- Automatic filtering based on user role

### Session Management
- Automatic logout on authentication errors
- Secure token handling with Firebase Auth
- Session persistence across browser refreshes

### Data Protection
- GDPR-compliant access control
- User role verification before operations
- Audit trail for all data modifications

## Usage Examples

### Component Error Handling
```javascript
import { handleFirebaseError } from '../utils/errorHandling'

const loadData = async () => {
  try {
    setLoading(true)
    setError('')
    const data = await someFirebaseOperation()
    setData(data)
  } catch (error) {
    handleFirebaseError(error, setError, navigate)
  } finally {
    setLoading(false)
  }
}
```

### Alert Error Handling
```javascript
import { handleErrorForAlert } from '../utils/errorHandling'

const saveData = async () => {
  try {
    await someFirebaseOperation()
    alert('Data gemt!')
  } catch (error) {
    const errorMessage = handleErrorForAlert(error)
    alert(errorMessage)
  }
}
```

### Permission Checking
```javascript
import { hasPermission } from '../utils/errorHandling'

const canEdit = hasPermission(currentUser, 'write', patient)
if (!canEdit) {
  setError('Du har ikke tilladelse til at redigere denne patient.')
  return
}
```

## Testing

### Manual Testing
1. Test with invalid credentials
2. Test with expired sessions
3. Test with network disconnection
4. Test role-based access scenarios

### Error Scenarios
1. **Permission Denied**: Employee trying to access admin functions
2. **Unauthenticated**: Expired session during operation
3. **Network Issues**: Offline or slow connection
4. **Invalid Data**: Malformed input or missing fields

## Maintenance

### Adding New Error Types
1. Add error code to `errorMessages` object
2. Update `handleFirebaseError` function if special handling needed
3. Test new error scenarios

### Updating Messages
1. Modify `errorMessages` object in `errorHandling.js`
2. Ensure consistency across all components
3. Test with actual users for clarity

## Benefits

### User Experience
- Clear, actionable error messages in Danish
- Consistent error handling across application
- Automatic session management

### Developer Experience
- Centralized error handling logic
- Reusable utility functions
- Consistent error patterns

### Security
- Proper authentication state management
- Role-based access enforcement
- Secure error information disclosure
