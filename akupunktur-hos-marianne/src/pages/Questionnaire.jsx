import { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import LanguageContext from '../contexts/LanguageContext'
import { translations } from '../data/translations'
import questionnaireTemplates from '../data/questionnaireTemplates'
import './Questionnaire.css'

const Questionnaire = () => {
  const { id } = useParams()
  const { language } = useContext(LanguageContext)
  const t = translations[language]
  
  const [questionnaire, setQuestionnaire] = useState(null)
  const [answers, setAnswers] = useState({})
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    // In a real app, you would fetch this from an API based on the questionnaire ID
    // For now, we'll use a template based on a pattern in the ID
    const templateId = id.includes('who5') ? 'who5' : 
                     id.includes('pain') ? 'pain-scale' :
                     id.includes('progress') ? 'treatment-progress' :
                     id.includes('lifestyle') ? 'lifestyle' :
                     'initial-health'
    
    const template = questionnaireTemplates[templateId]
    if (template) {
      setQuestionnaire({
        id: id,
        patientName: 'Current Patient', // This would come from the API
        ...template
      })
    }
  }, [id])

  const handleAnswerChange = (questionId, value) => {
    setAnswers({
      ...answers,
      [questionId]: value
    })
  }

  const handleCheckboxChange = (questionId, option, checked) => {
    const currentAnswers = answers[questionId] || []
    if (checked) {
      setAnswers({
        ...answers,
        [questionId]: [...currentAnswers, option]
      })
    } else {
      setAnswers({
        ...answers,
        [questionId]: currentAnswers.filter(item => item !== option)
      })
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Validate required questions
    const requiredQuestions = questionnaire.questions.filter(q => q.required)
    const unansweredRequired = requiredQuestions.find(q => !answers[q.id])
    
    if (unansweredRequired) {
      alert(t.requiredValidation)
      return
    }

    // TODO: Submit answers to backend
    console.log('Questionnaire answers:', answers)
    setSubmitted(true)
  }

  const renderQuestion = (question) => {
    switch (question.type) {
      case 'text':
        return (
          <input
            type="text"
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="text-input"
          />
        )
      
      case 'textarea':
        return (
          <textarea
            value={answers[question.id] || ''}
            onChange={(e) => handleAnswerChange(question.id, e.target.value)}
            className="textarea-input"
            rows="4"
          />
        )
      
      case 'scale':
        return (
          <div className="scale-input">
            {question.labels && question.labels.length > 2 ? (
              // WHO-5 style with discrete options
              <div className="discrete-scale">
                {question.labels.map((label, index) => (
                  <label key={index} className="scale-option">
                    <input
                      type="radio"
                      name={`question-${question.id}`}
                      value={index}
                      checked={answers[question.id] === index}
                      onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                    />
                    <span className="scale-label">{index}</span>
                    <span className="scale-description">{label}</span>
                  </label>
                ))}
              </div>
            ) : (
              // Traditional slider scale
              <>
                <div className="scale-labels">
                  <span>{question.labels ? question.labels[0] : `${question.min} (${question.min === 0 ? t.noPain || 'Ingen smerte' : t.minimum || 'Minimum'})`}</span>
                  <span>{question.labels ? question.labels[1] : `${question.max} (${t.maximum || 'Maksimum'})`}</span>
                </div>
                <input
                  type="range"
                  min={question.min}
                  max={question.max}
                  value={answers[question.id] || question.min}
                  onChange={(e) => handleAnswerChange(question.id, parseInt(e.target.value))}
                  className="range-slider"
                />
                <div className="scale-value">
                  {t.currentValue || 'Nuværende værdi'}: {answers[question.id] || question.min}
                </div>
              </>
            )}
          </div>
        )
      
      case 'multiple-choice':
        return (
          <div className="radio-group">
            {question.options.map((option, index) => (
              <label key={index} className="radio-option">
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option}
                  checked={answers[question.id] === option}
                  onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                />
                {option}
              </label>
            ))}
          </div>
        )
      
      case 'checkbox':
        return (
          <div className="checkbox-group">
            {question.options.map((option, index) => (
              <label key={index} className="checkbox-option">
                <input
                  type="checkbox"
                  checked={(answers[question.id] || []).includes(option)}
                  onChange={(e) => handleCheckboxChange(question.id, option, e.target.checked)}
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

  if (!questionnaire) {
    return (
      <div className="questionnaire-container">
        <div className="questionnaire-card">
          <div className="loading-message">
            <h1>{t.loadingQuestionnaire}</h1>
            <p>{t.waitMessage}</p>
          </div>
        </div>
      </div>
    )
  }

  if (submitted) {
    return (
      <div className="questionnaire-container">
        <div className="questionnaire-card">
          <div className="success-message">
            <h1>{t.thankYou}</h1>
            <p>{t.submissionSuccess}</p>
            <p>{t.submissionMessage}</p>
            <div className="success-icon">✓</div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="questionnaire-container">
      <div className="questionnaire-card">
        <div className="questionnaire-header">
          <h1>{questionnaire.title}</h1>
          <p className="patient-name">{t.patient}: {questionnaire.patientName}</p>
          <p className="instructions">{questionnaire.instructions}</p>
        </div>

        <form onSubmit={handleSubmit} className="questionnaire-form">
          {questionnaire.questions.map((question, index) => (
            <div key={question.id} className="question-group">
              <label className="question-label">
                {index + 1}. {question.question}
                {question.required && <span className="required">*</span>}
              </label>
              {renderQuestion(question)}
            </div>
          ))}

          <div className="form-footer">
            <p className="required-note">{t.requiredFields}</p>
            <button type="submit" className="submit-questionnaire-btn">
              {t.submitQuestionnaire}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Questionnaire
