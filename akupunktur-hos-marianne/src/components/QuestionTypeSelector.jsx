import { useState } from 'react'
import './QuestionTypeSelector.css'

// Simple inline question types for Phase 1
const simpleQuestionTypes = {
  'scale': { label: 'Skala', description: 'Numerisk skala (fx 1-10)', icon: '📊' },
  'multiple-choice': { label: 'Multiple Choice', description: 'Vælg én mulighed', icon: '�' },
  'text': { label: 'Tekst', description: 'Kort tekst input', icon: '�' },
  'textarea': { label: 'Multi-linje Tekst', description: 'Lang tekst område', icon: '�' }
}

const createSimpleQuestion = (type, id) => ({
  id: id || Date.now(),
  type: type || 'text',
  question: '',
  required: true
})

const QuestionTypeSelector = ({ onAddQuestion, onClose }) => {
  const [selectedType, setSelectedType] = useState(null)

  const handleAddQuestion = (type) => {
    const newQuestion = createSimpleQuestion(type, Date.now())
    onAddQuestion(newQuestion)
    onClose()
  }

  return (
    <div className="question-type-selector-overlay">
      <div className="question-type-selector">
        <div className="selector-header">
          <h3>Vælg Spørgsmål Type</h3>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>
        
        <div className="question-types-grid">
          {Object.entries(simpleQuestionTypes).map(([key, type]) => (
            <div
              key={key}
              className={`question-type-card ${selectedType === key ? 'selected' : ''}`}
              onClick={() => setSelectedType(key)}
              onDoubleClick={() => handleAddQuestion(key)}
            >
              <div className="type-icon">{type.icon}</div>
              <div className="type-info">
                <h4>{type.label}</h4>
                <p>{type.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="selector-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            Annuller
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => selectedType && handleAddQuestion(selectedType)}
            disabled={!selectedType}
          >
            Tilføj Spørgsmål
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionTypeSelector
