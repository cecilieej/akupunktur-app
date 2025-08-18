import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { patientQuestionnairesService, patientsService } from '../services/firebaseService'
import { validateQuestionnaireAccess } from '../utils/tokenUtils'
import './QuestionnaireForm.css'

const QuestionnaireForm = () => {
  const { patientId, questionnaireId, token } = useParams()
  const navigate = useNavigate()
  
  const [questionnaire, setQuestionnaire] = useState(null)
  const [patient, setPatient] = useState(null)
  const [responses, setResponses] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadQuestionnaire()
  }, [token])

  const loadQuestionnaire = async () => {
    try {
      setLoading(true)
      const data = await patientQuestionnairesService.getByToken(token)
      
      // Validate access
      validateQuestionnaireAccess(data)
      
      setQuestionnaire(data)
      
      // Load patient information
      if (data.patientId) {
        try {
          const patientData = await patientsService.getById(data.patientId)
          setPatient(patientData)
        } catch (patientError) {
          console.error('Error loading patient data:', patientError)
        }
      }
      
      setError('')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleResponseChange = (questionId, value) => {
    setResponses(prev => ({
      ...prev,
      [questionId]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!questionnaire) return
    
    // Validate required fields
    const requiredQuestions = questionnaire.questions.filter(q => q.required)
    const missingAnswers = requiredQuestions.filter(q => !responses[q.id])
    
    if (missingAnswers.length > 0) {
      setError('Udfyld venligst alle påkrævede felter')
      return
    }
    
    try {
      setSubmitting(true)
      
      // Update questionnaire with responses
      await patientQuestionnairesService.update(questionnaire.id, {
        responses,
        status: 'completed',
        dateCompleted: new Date().toISOString()
      })
      
      // Redirect to success page
      navigate('/questionnaire/success')
    } catch (err) {
      setError('Fejl ved indsendelse af svar. Prøv igen.')
    } finally {
      setSubmitting(false)
    }
  }

  const renderQuestion = (question) => {
    const value = responses[question.id] || ''
    
    switch (question.type) {
      case 'scale':
        // Generate scale values based on question's min and max properties
        const minValue = question.min || 0
        const maxValue = question.max || 10
        const scaleValues = Array.from({ length: maxValue - minValue + 1 }, (_, i) => minValue + i)
        
        return (
          <div className="scale-question">
            <div className="scale-options">
              {scaleValues.map((scaleValue) => (
                <label key={scaleValue} className="scale-option">
                  <input
                    type="radio"
                    name={question.id}
                    value={scaleValue.toString()}
                    checked={value === scaleValue.toString()}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  />
                  <div className="scale-value">{scaleValue}</div>
                </label>
              ))}
            </div>
          </div>
        )
      
      case 'multiple_choice':
      case 'multiple-choice':
        if (!question.options || !Array.isArray(question.options) || question.options.length === 0) {
          console.error('Missing or invalid options for question:', question.id, question)
          return (
            <div className="error-message" style={{ color: 'red', padding: '1rem', border: '1px solid red', borderRadius: '4px' }}>
              <strong>Fejl:</strong> Ingen valgmuligheder fundet for dette spørgsmål.
              <br />
              <small>Spørgsmål ID: {question.id}</small>
            </div>
          )
        }
        return (
          <div className="multiple-choice-question">
            {question.options.map((option, index) => (
              <label key={index} className="choice-option">
                <input
                  type="radio"
                  name={question.id}
                  value={option}
                  checked={value === option}
                  onChange={(e) => handleResponseChange(question.id, e.target.value)}
                />
                {option}
              </label>
            ))}
          </div>
        )
      
      case 'number':
        return (
          <input
            type="number"
            min={question.min || 0}
            max={question.max || 100}
            value={value}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            className="number-input"
          />
        )
      
      case 'textarea':
        return (
          <textarea
            value={value}
            onChange={(e) => handleResponseChange(question.id, e.target.value)}
            rows="4"
            className="text-area"
            placeholder="Skriv dit svar her..."
          />
        )
      
      case 'checkbox':
        return (
          <div className="checkbox-question">
            {question.options.map((option, index) => (
              <label key={index} className="checkbox-option">
                <input
                  type="checkbox"
                  name={question.id}
                  value={option}
                  checked={Array.isArray(value) ? value.includes(option) : false}
                  onChange={(e) => {
                    const currentValues = Array.isArray(value) ? value : []
                    if (e.target.checked) {
                      handleResponseChange(question.id, [...currentValues, option])
                    } else {
                      handleResponseChange(question.id, currentValues.filter(v => v !== option))
                    }
                  }}
                />
                {option}
              </label>
            ))}
          </div>
        )
      
      default:
        return null
    }
  }

  if (loading) {
    return (
      <div className="questionnaire-container">
        <div className="loading">Indlæser spørgeskema...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="questionnaire-container">
        <div className="error-message">
          <h2>Fejl</h2>
          <p>{error}</p>
        </div>
      </div>
    )
  }

  if (!questionnaire) {
    return (
      <div className="questionnaire-container">
        <div className="error-message">
          <h2>Spørgeskema ikke fundet</h2>
          <p>Det ønskede spørgeskema kunne ikke findes.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-header">
        <h1>{questionnaire.title}</h1>
        {patient && (
          <p className="patient-name">
            <strong>Patient:</strong> {patient.name.split(' ')[0]}
          </p>
        )}
        <p className="description">{questionnaire.description}</p>
      </div>

      {questionnaire.instructions && questionnaire.instructions.trim() && (
        <div className="instructions sticky-instructions">
          <strong>Instruktioner:</strong> {questionnaire.instructions}
        </div>
      )}

      <form onSubmit={handleSubmit} className="questionnaire-form">
        {questionnaire.questions.map((question, index) => (
          <div key={question.id} className="question-block">
            <div className="question-header">
              <span className="question-number">{index + 1}.</span>
              <span className="question-text">{question.question}</span>
              {question.required && <span className="required">*</span>}
            </div>
            <div className="question-input">
              {renderQuestion(question)}
            </div>
          </div>
        ))}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <button 
          type="submit" 
          className="submit-button"
          disabled={submitting}
        >
          {submitting ? 'Indsender...' : 'Indsend Svar'}
        </button>
      </form>
    </div>
  )
}

export default QuestionnaireForm
