import { useState } from 'react'
import { danishTexts } from '../data/danishTexts'
import './QuestionnaireResults.css'

const QuestionnaireResults = ({ questionnaire, onClose, onEditDate }) => {
  const [isEditingDate, setIsEditingDate] = useState(false)
  const [editDate, setEditDate] = useState(
    questionnaire.dateCompleted ? new Date(questionnaire.dateCompleted).toISOString().split('T')[0] : ''
  )

  const handleDateSave = () => {
    onEditDate(questionnaire.id, editDate)
    setIsEditingDate(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Ingen dato'
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return 'Ugyldig dato'
      return date.toLocaleDateString('da-DK')
    } catch (error) {
      return 'Ugyldig dato'
    }
  }

  const renderAnswer = (question, answer) => {
    if (!answer && answer !== 0) {
      return <div className="answer-text">Ingen svar</div>
    }

    switch (question.type) {
      case 'scale':
        return (
          <div className="answer-scale">
            <span className="scale-value">{answer}</span>
            <span className="scale-label">
              {answer === '0' || answer === 0 ? 'På intet tidspunkt' :
               answer === '1' || answer === 1 ? 'En lille del af tiden' :
               answer === '2' || answer === 2 ? 'Lidt under halvdelen af tiden' :
               answer === '3' || answer === 3 ? 'Lidt over halvdelen af tiden' :
               answer === '4' || answer === 4 ? 'Det meste af tiden' :
               answer === '5' || answer === 5 ? 'Hele tiden' :
               `${answer}/5`}
            </span>
          </div>
        )
      case 'multiple_choice':
      case 'multiple-choice':
        return <div className="answer-choice">{answer}</div>
      case 'checkbox':
        return (
          <div className="answer-checkbox">
            {Array.isArray(answer) ? answer.join(', ') : answer}
          </div>
        )
      case 'textarea':
        return <div className="answer-textarea">{answer || 'Ingen svar'}</div>
      case 'number':
        return <div className="answer-number">{answer}</div>
      default:
        return <div className="answer-text">{answer}</div>
    }
  }

  return (
    <div className="results-overlay">
      <div className="results-modal">
        <div className="results-header">
          <h2>{questionnaire.title}</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>
        
        <div className="results-info">
          <div className="completion-date">
            <strong>Gennemført: </strong>
            {isEditingDate ? (
              <div className="date-edit">
                <input
                  type="date"
                  value={editDate}
                  onChange={(e) => setEditDate(e.target.value)}
                />
                <button onClick={handleDateSave} className="save-date-btn">Gem</button>
                <button onClick={() => setIsEditingDate(false)} className="cancel-date-btn">Annuller</button>
              </div>
            ) : (
              <div className="date-display">
                <span>{formatDate(questionnaire.dateCompleted)}</span>
                <button onClick={() => setIsEditingDate(true)} className="edit-date-btn">
                  Rediger dato
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="results-content">
          <div className="questions-answers">
            {!questionnaire.questions || questionnaire.questions.length === 0 ? (
              <div className="no-questions">
                <p>Ingen spørgsmål fundet for dette spørgeskema.</p>
              </div>
            ) : (
              questionnaire.questions.map((question, index) => (
                <div key={question.id} className="question-result">
                  <div className="question-text">
                    <span className="question-number">{index + 1}.</span>
                    {question.question}
                  </div>
                  <div className="answer-container">
                    {renderAnswer(question, questionnaire.responses?.[question.id])}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="results-footer">
          <button onClick={onClose} className="close-results-btn">
            Luk
          </button>
        </div>
      </div>
    </div>
  )
}

export default QuestionnaireResults
