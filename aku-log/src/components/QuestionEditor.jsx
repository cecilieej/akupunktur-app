import { useState } from 'react'
import './QuestionEditor.css'

// Simple inline question types for Phase 1
const simpleQuestionTypes = {
  'scale': { label: 'Skala', description: 'Numerisk skala (fx 1-10)', icon: '📊', defaultConfig: { min: 0, max: 10 } },
  'multiple-choice': { label: 'Multiple Choice', description: 'Vælg én mulighed', icon: '🔘', defaultConfig: { options: ['Mulighed 1', 'Mulighed 2'] } },
  'text': { label: 'Tekst', description: 'Kort tekst input', icon: '📝', defaultConfig: {} },
  'textarea': { label: 'Multi-linje Tekst', description: 'Lang tekst område', icon: '📄', defaultConfig: {} }
}

// Simple inline validation for Phase 1
const validateSimpleQuestion = (question) => {
  const errors = []
  if (!question.question || !question.question.trim()) {
    errors.push('Question text is required')
  }
  return errors
}

const QuestionEditor = ({ question, onUpdate, onDelete, onMoveUp, onMoveDown, canMoveUp, canMoveDown, questionNumber }) => {
  const [isExpanded, setIsExpanded] = useState(false)
  const [errors, setErrors] = useState([])

  const handleFieldChange = (field, value) => {
    const updatedQuestion = {
      ...question,
      [field]: value
    }
    
    // Validate question
    const validationErrors = validateSimpleQuestion(updatedQuestion)
    setErrors(validationErrors)
    
    onUpdate(updatedQuestion)
  }

  const questionType = simpleQuestionTypes[question.type]

  return (
    <div className={`question-editor ${isExpanded ? 'expanded' : ''} ${errors.length > 0 ? 'has-errors' : ''}`}>
      <div className="question-header">
        <div className="question-info">
          <span className="question-number">#{questionNumber}</span>
          <span className="question-type-badge">
            {questionType?.icon} {questionType?.label}
          </span>
          <span className="question-text">
            {(question.question || 'Untitled Question').length > 100 
              ? (question.question || 'Untitled Question').substring(0, 100) + '...'
              : (question.question || 'Untitled Question')
            }
          </span>
        </div>
        
        <div className="question-actions">
          <button
            type="button"
            className="btn btn-small btn-secondary"
            onClick={() => onMoveUp()}
            disabled={!canMoveUp}
            title="Flyt op"
          >
            ↑
          </button>
          <button
            type="button"
            className="btn btn-small btn-secondary"
            onClick={() => onMoveDown()}
            disabled={!canMoveDown}
            title="Flyt ned"
          >
            ↓
          </button>
          <button
            type="button"
            className="btn btn-small btn-primary"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            {isExpanded ? 'Luk' : 'Rediger'}
          </button>
          <button
            type="button"
            className="btn btn-small btn-danger"
            onClick={() => onDelete()}
            title="Slet spørgsmål"
          >
            🗑️
          </button>
        </div>
      </div>

      {errors.length > 0 && (
        <div className="question-errors">
          {errors.map((error, index) => (
            <div key={index} className="error-item">{error}</div>
          ))}
        </div>
      )}

      {isExpanded && (
        <div className="question-config">
          <div className="basic-config">
            <div className="config-field">
              <label>Spørgsmål Tekst *</label>
              <textarea
                value={question.question}
                onChange={(e) => handleFieldChange('question', e.target.value)}
                placeholder="Indtast dit spørgsmål her"
                rows="3"
                required
              />
            </div>

            <div className="config-field">
              <label>Spørgsmål Type</label>
              <select
                value={question.type}
                onChange={(e) => {
                  const newType = e.target.value
                  const defaultQuestion = {
                    ...question,
                    type: newType,
                    ...simpleQuestionTypes[newType].defaultConfig
                  }
                  onUpdate(defaultQuestion)
                }}
              >
                {Object.entries(simpleQuestionTypes).map(([key, type]) => (
                  <option key={key} value={key}>
                    {type.icon} {type.label} - {type.description}
                  </option>
                ))}
              </select>
            </div>

            <div className="config-field checkbox-field">
              <label>
                <input
                  type="checkbox"
                  checked={question.required}
                  onChange={(e) => handleFieldChange('required', e.target.checked)}
                />
                Påkrævet spørgsmål
              </label>
            </div>

            {/* Simple configuration for multiple choice */}
            {question.type === 'multiple-choice' && (
              <div className="config-field array-field">
                <label>Valgmuligheder</label>
                <div className="options-list">
                  {(question.options || ['Mulighed 1', 'Mulighed 2']).map((option, index) => (
                    <div key={index} className="option-item">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...(question.options || [])]
                          newOptions[index] = e.target.value
                          handleFieldChange('options', newOptions)
                        }}
                        placeholder={`Mulighed ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = (question.options || []).filter((_, i) => i !== index)
                          handleFieldChange('options', newOptions)
                        }}
                        className="btn btn-danger btn-small"
                        disabled={(question.options || []).length <= 1}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => {
                      const newOptions = [...(question.options || []), '']
                      handleFieldChange('options', newOptions)
                    }}
                    className="btn btn-secondary btn-small add-option-btn"
                  >
                    + Tilføj mulighed
                  </button>
                </div>
              </div>
            )}

            {/* Simple configuration for scale */}
            {question.type === 'scale' && (
              <>
                <div className="config-field">
                  <label>Minimum værdi</label>
                  <input
                    type="number"
                    value={question.min || 0}
                    onChange={(e) => handleFieldChange('min', parseInt(e.target.value) || 0)}
                  />
                </div>
                <div className="config-field">
                  <label>Maximum værdi</label>
                  <input
                    type="number"
                    value={question.max || 10}
                    onChange={(e) => handleFieldChange('max', parseInt(e.target.value) || 10)}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionEditor
