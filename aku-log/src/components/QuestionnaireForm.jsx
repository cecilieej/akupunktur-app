import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { patientQuestionnairesService } from '../services/firebaseService'
import { validateQuestionnaireAccess } from '../utils/tokenUtils'
import { questionnaireQuestions } from '../data/questionnaireQuestions'
import './QuestionnaireForm.css'

const QuestionnaireForm = () => {
  const { patientId, questionnaireId, token } = useParams()
  const navigate = useNavigate()
  
  const [questionnaire, setQuestionnaire] = useState(null)
  const [responses, setResponses] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const questionData = questionnaireQuestions[questionnaireId]

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
    
    if (!questionnaire || !questionData) return
    
    // Validate required fields
    const requiredQuestions = questionData.questions.filter(q => q.required)
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
        return (
          <div className="scale-question">
            <div className="scale-options">
              {Object.entries(questionData.scale).map(([scaleValue, scaleLabel]) => (
                <label key={scaleValue} className="scale-option">
                  <input
                    type="radio"
                    name={question.id}
                    value={scaleValue}
                    checked={value === scaleValue}
                    onChange={(e) => handleResponseChange(question.id, e.target.value)}
                  />
                  <div className="scale-value">{scaleValue}</div>
                  <div className="scale-label">{scaleLabel}</div>
                </label>
              ))}
            </div>
          </div>
        )
      
      case 'multiple_choice':
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

  if (!questionData) {
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
        <h1>{questionData.title}</h1>
        <p className="description">{questionData.description}</p>
        {questionData.instructions && (
          <div className="instructions">
            <strong>Instruktioner:</strong> {questionData.instructions}
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="questionnaire-form">
        {questionData.questions.map((question, index) => (
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
