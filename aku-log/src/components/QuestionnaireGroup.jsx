import { useState } from 'react'
import { danishTexts } from '../data/danishTexts'
import './QuestionnaireGroup.css'

const QuestionnaireGroup = ({ 
  questionnaires, 
  onViewResults, 
  onDeleteQuestionnaire, 
  onCopyLink 
}) => {
  const [isExpanded, setIsExpanded] = useState(false)
  
  if (questionnaires.length === 0) return null
  
  // Get the template info from the first questionnaire
  const templateInfo = questionnaires[0]
  const completedCount = questionnaires.filter(q => q.status === 'completed').length
  const totalCount = questionnaires.length
  
  // Sort questionnaires by date (newest first)
  const sortedQuestionnaires = [...questionnaires].sort((a, b) => {
    const dateA = new Date(a.dateCompleted || a.assignedDate)
    const dateB = new Date(b.dateCompleted || b.assignedDate)
    return dateB - dateA
  })

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

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#28a745'
      case 'pending': return '#ffc107'
      case 'overdue': return '#dc3545'
      default: return '#6c757d'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed': return 'Gennemført'
      case 'pending': return 'Afventer'
      case 'overdue': return 'Forsinket'
      default: return status
    }
  }

  return (
    <div className="questionnaire-group">
      <div 
        className="group-header"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="group-info">
          <h4 className="group-title">{templateInfo.title}</h4>
          <span className="group-summary">
            {completedCount}/{totalCount} gennemført
          </span>
        </div>
        <div className="group-controls">
          <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
            ▼
          </span>
        </div>
      </div>
      
      {isExpanded && (
        <div className="group-content">
          {sortedQuestionnaires.map((questionnaire, index) => (
            <div key={questionnaire.id} className="questionnaire-item">
              <div className="questionnaire-info">
                <div className="questionnaire-date">
                  {questionnaire.status === 'completed' ? (
                    <>
                      <strong>Gennemført:</strong> {formatDate(questionnaire.dateCompleted)}
                    </>
                  ) : (
                    <>
                      <strong>Tildelt:</strong> {formatDate(questionnaire.assignedDate)}
                    </>
                  )}
                </div>
                <div 
                  className="questionnaire-status"
                  style={{ backgroundColor: getStatusColor(questionnaire.status) }}
                >
                  {getStatusText(questionnaire.status)}
                </div>
              </div>
              
              <div className="questionnaire-actions">
                {questionnaire.status === 'completed' ? (
                  <button 
                    onClick={() => onViewResults(questionnaire)}
                    className="btn-view-results"
                  >
                    Se Resultater
                  </button>
                ) : (
                  <button 
                    onClick={() => onCopyLink(questionnaire)}
                    className="btn-copy-link"
                  >
                    Kopier Link
                  </button>
                )}
                
                <button 
                  onClick={() => onDeleteQuestionnaire(questionnaire.id)}
                  className="btn-delete"
                >
                  Slet
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default QuestionnaireGroup
