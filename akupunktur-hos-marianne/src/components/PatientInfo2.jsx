import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../data/translations'
import './PatientInfo.css'

const PatientInfo = ({ patient, onEdit, onDelete, availableQuestionnaires }) => {
  const { language } = useLanguage()
  const t = translations[language]
  
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

  return (
    <div className="patient-info">
      <div className="patient-header">
        <div className="patient-title-row">
          <h2>{patient.name}</h2>
          <div className="patient-actions">
            <button className="edit-patient-btn" onClick={onEdit}>
              {t.editPatientBtn}
            </button>
            <button className="delete-patient-btn" onClick={onDelete}>
              {t.deletePatientBtn}
            </button>
          </div>
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
                      <button className="copy-link-btn">
                        {t.copyPatientLink}
                      </button>
                      <button className="send-reminder-btn">
                        {t.sendReminder}
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
        
        <button className="add-questionnaire-btn">
          {t.createNewQuestionnaire}
        </button>
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
    </div>
  )
}

export default PatientInfo
