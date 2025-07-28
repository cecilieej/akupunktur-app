import { useState } from 'react'
import { danishTexts } from '../data/danishTexts'
import './PatientInfo.css'

const PatientInfo = ({ patient, onEdit, onDelete, availableQuestionnaires, onAddQuestionnaire, onDeleteQuestionnaire }) => {
  const t = danishTexts
  const [showAddQuestionnaire, setShowAddQuestionnaire] = useState(false)
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('')
  
  if (!patient) {
    return <div>No patient selected</div>
  }
  
  if (!t) {
    return <div>Translations not loaded</div>
  }
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#28a745'
      case 'pending':
        return '#ffc107'
      case 'overdue':
        return '#dc3545'
      default:
        return '#6c757d'
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return t.completed
      case 'pending':
        return t.pending
      case 'overdue':
        return t.overdue
      default:
        return status
    }
  }

  const handleAddQuestionnaire = () => {
    if (selectedQuestionnaire && onAddQuestionnaire) {
      onAddQuestionnaire(patient.id, selectedQuestionnaire)
      setSelectedQuestionnaire('')
      setShowAddQuestionnaire(false)
    }
  }

  const handleDeleteQuestionnaire = (questionnaireId) => {
    if (window.confirm(t.deleteQuestionnaireConfirm) && onDeleteQuestionnaire) {
      onDeleteQuestionnaire(patient.id, questionnaireId)
    }
  }

  const handleCopyLink = async (questionnaire) => {
    // For now, this will generate a mock link until Firebase is connected
    // In real implementation, this would create the questionnaire in Firebase first
    const mockToken = Math.random().toString(36).substr(2, 32)
    const link = `${window.location.origin}/questionnaire/${patient.id}/${questionnaire.templateId}/${mockToken}`
    
    try {
      await navigator.clipboard.writeText(link)
      alert('Link kopieret til udklipsholder!')
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = link
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      alert('Link kopieret til udklipsholder!')
    }
  }

  return (
    <div className="patient-info">
      <div className="patient-header">
        <div className="patient-title-row">
          <h2>{patient.name}</h2>
        </div>
        <div className="patient-basic-info">
          <div className="info-item">
            <label>{t.ageLabel}:</label>
            <span>{patient.age} år</span>
          </div>
          <div className="info-item">
            <label>{t.phoneLabel}:</label>
            <span>{patient.phone}</span>
          </div>
          <div className="info-item">
            <label>{t.email}:</label>
            <span>{patient.email}</span>
          </div>
          <div className="info-item">
            <label>{t.conditionLabel}:</label>
            <span>{patient.condition}</span>
          </div>
        </div>
      </div>

      <div className="questionnaires-section">
        <h3>{t.questionnaires}</h3>
        {patient.questionnaires && patient.questionnaires.length > 0 ? (
          <div className="questionnaires-list">
            {patient.questionnaires.map(questionnaire => (
              <div key={questionnaire.id} className="questionnaire-item">
                <div className="questionnaire-info">
                  <h4>{questionnaire.title}</h4>
                  <p>Dato: {questionnaire.date}</p>
                  <div className="status-container">
                    <span 
                      className="status"
                      style={{ color: getStatusColor(questionnaire.status) }}
                    >
                      {getStatusText(questionnaire.status)}
                    </span>
                  </div>
                </div>
                <div className="questionnaire-actions">
                  {questionnaire.status === 'completed' ? (
                    <button className="view-results-btn">
                      {t.viewResults}
                    </button>
                  ) : (
                    <div className="pending-actions">
                      <button 
                        className="copy-link-btn"
                        onClick={() => handleCopyLink(questionnaire)}
                      >
                        {t.copyPatientLink}
                      </button>
                      <button 
                        className="delete-questionnaire-btn"
                        onClick={() => handleDeleteQuestionnaire(questionnaire.id)}
                      >
                        {t.deleteQuestionnaire}
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-questionnaires">{t.noQuestionnaires}</p>
        )}
        
        {!showAddQuestionnaire ? (
          <button 
            className="add-questionnaire-btn"
            onClick={() => setShowAddQuestionnaire(true)}
          >
            {t.createNewQuestionnaire}
          </button>
        ) : (
          <div className="add-questionnaire-form">
            <h4>{t.selectQuestionnaire}</h4>
            <select 
              value={selectedQuestionnaire}
              onChange={(e) => setSelectedQuestionnaire(e.target.value)}
              className="questionnaire-select"
            >
              <option value="">{t.chooseQuestionnaire}</option>
              {availableQuestionnaires.map(q => (
                <option key={q.id} value={q.id}>
                  {q.title}
                </option>
              ))}
            </select>
            <div className="questionnaire-form-actions">
              <button 
                className="add-btn"
                onClick={handleAddQuestionnaire}
                disabled={!selectedQuestionnaire}
              >
                {t.addQuestionnaire}
              </button>
              <button 
                className="cancel-btn"
                onClick={() => {
                  setShowAddQuestionnaire(false)
                  setSelectedQuestionnaire('')
                }}
              >
                {t.cancel}
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="notes-section">
        <h3>{t.treatmentNotes}</h3>
        <textarea 
          className="notes-textarea"
          placeholder={t.addTreatmentNotes}
          rows="4"
        ></textarea>
        <button className="save-notes-btn">{t.saveNotes}</button>
      </div>

      <div className="patient-actions">
        <button className="edit-patient-btn" onClick={onEdit}>
          {t.editPatientBtn}
        </button>
        <button className="delete-patient-btn" onClick={onDelete}>
          {t.deletePatientBtn}
        </button>
      </div>
    </div>
  )
}

export default PatientInfo
