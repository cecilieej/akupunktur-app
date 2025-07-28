import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import Navigation from './components/Navigation'
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
            {/* Admin/Staff routes with navigation */}
            <Route path="/login" element={
              <div>
                <Navigation />
                <main className="main-content">
                  <Login />
                </main>
              </div>
            } />
            <Route path="/overview" element={
              <div>
                <Navigation />
                <main className="main-content">
                  <Overview />
                </main>
              </div>
            } />
            <Route path="/questionnaire/:id" element={
              <div>
                <Navigation />
                <main className="main-content">
                  <Questionnaire />
                </main>
              </div>
            } />
            
            {/* Patient-facing routes without navigation */}
            <Route path="/questionnaire/:patientId/:questionnaireId/:token" element={<QuestionnaireForm />} />
            <Route path="/questionnaire/success" element={<QuestionnaireSuccess />} />
            
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App
