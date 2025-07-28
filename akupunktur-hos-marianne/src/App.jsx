import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Navigation from './components/Navigation'
import ProtectedRoute from './components/ProtectedRoute'
import Login from './pages/Login'
import Overview from './pages/Overview'
import Questionnaire from './pages/Questionnaire'
import QuestionnaireForm from './components/QuestionnaireForm'
import QuestionnaireSuccess from './components/QuestionnaireSuccess'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="app">
          <Routes>
            {/* Public login route */}
            <Route path="/login" element={
              <div>
                <Navigation />
                <main className="main-content">
                  <Login />
                </main>
              </div>
            } />
            
            {/* Protected admin/staff routes */}
            <Route path="/overview" element={
              <ProtectedRoute>
                <div>
                  <Navigation />
                  <main className="main-content">
                    <Overview />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            <Route path="/questionnaire/:id" element={
              <ProtectedRoute>
                <div>
                  <Navigation />
                  <main className="main-content">
                    <Questionnaire />
                  </main>
                </div>
              </ProtectedRoute>
            } />
            
            {/* Patient-facing routes without navigation or authentication */}
            <Route path="/questionnaire/:patientId/:questionnaireId/:token" element={<QuestionnaireForm />} />
            <Route path="/questionnaire/success" element={<QuestionnaireSuccess />} />
            
            <Route path="/" element={<Navigate to="/overview" replace />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
