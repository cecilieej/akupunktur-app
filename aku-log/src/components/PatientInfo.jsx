import { useState } from 'react'
import { danishTexts } from '../data/danishTexts'
import { patientQuestionnairesService, patientsService } from '../services/firebaseService'
import QuestionnaireGroup from './QuestionnaireGroup'
import QuestionnaireResults from './QuestionnaireResults'
import './PatientInfo.css'

const PatientInfo = ({ patient, onEdit, onDelete, availableQuestionnaires, onAddQuestionnaire, onDeleteQuestionnaire, onUpdatePatient }) => {
  const t = danishTexts
  const [showAddQuestionnaire, setShowAddQuestionnaire] = useState(false)
  const [selectedQuestionnaire, setSelectedQuestionnaire] = useState('')
  const [showResults, setShowResults] = useState(false)
  const [selectedQuestionnaireForResults, setSelectedQuestionnaireForResults] = useState(null)
  const [treatmentNotes, setTreatmentNotes] = useState(patient.treatmentNotes || '')
  const [isEditingNotes, setIsEditingNotes] = useState(!patient.treatmentNotes)
  const [tempNotes, setTempNotes] = useState('')
  
  if (!patient) {
    return <div>No patient selected</div>
  }
  
  if (!t) {
    return <div>Translations not loaded</div>
  }

  // Group questionnaires by template/title
  const groupedQuestionnaires = patient.questionnaires ? patient.questionnaires.reduce((groups, questionnaire) => {
    const key = questionnaire.title || questionnaire.templateId
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(questionnaire)
    return groups
  }, {}) : {}

  const handleViewResults = (questionnaire) => {
    setSelectedQuestionnaireForResults(questionnaire)
    setShowResults(true)
  }

  const handleEditDate = async (questionnaireId, newDate) => {
    try {
      await patientQuestionnairesService.update(questionnaireId, {
        dateCompleted: new Date(newDate).toISOString()
      })
      
      // Update the selected questionnaire's date in the modal
      if (selectedQuestionnaireForResults && selectedQuestionnaireForResults.id === questionnaireId) {
        setSelectedQuestionnaireForResults({
          ...selectedQuestionnaireForResults,
          dateCompleted: new Date(newDate).toISOString()
        })
      }
      
      // Trigger parent component to reload data
      if (onUpdatePatient) {
        onUpdatePatient()
      }
    } catch (error) {
      console.error('Error updating questionnaire date:', error)
      alert('Fejl ved opdatering af dato')
    }
  }

  const handleSaveNotes = async () => {
    try {
      await patientsService.update(patient.id, {
        treatmentNotes: tempNotes
      })
      setTreatmentNotes(tempNotes)
      setIsEditingNotes(false)
      
      // Trigger parent component to reload data
      if (onUpdatePatient) {
        onUpdatePatient()
      }
    } catch (error) {
      console.error('Error saving treatment notes:', error)
      alert('Fejl ved gem af notater')
    }
  }

  const handleEditNotes = () => {
    setTempNotes(treatmentNotes)
    setIsEditingNotes(true)
  }

  const handleDeleteNotes = async () => {
    if (window.confirm('Er du sikker på at du vil slette behandlingsnotaterne?')) {
      try {
        await patientsService.update(patient.id, {
          treatmentNotes: ''
        })
        setTreatmentNotes('')
        setIsEditingNotes(true)
        setTempNotes('')
        
        // Trigger parent component to reload data
        if (onUpdatePatient) {
          onUpdatePatient()
        }
      } catch (error) {
        console.error('Error deleting treatment notes:', error)
        alert('Fejl ved sletning af notater')
      }
    }
  }

  const handleCancelNotes = () => {
    setTempNotes('')
    setIsEditingNotes(!treatmentNotes) // Only stay in edit mode if no notes exist
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
    // Use the actual access token from the questionnaire
    if (!questionnaire.accessToken) {
      alert('Fejl: Ingen adgangstoken fundet for dette spørgeskema.')
      return
    }
    
    const link = `${window.location.origin}/questionnaire/${patient.id}/${questionnaire.id}/${questionnaire.accessToken}`
    
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
        
        {Object.keys(groupedQuestionnaires).length === 0 ? (
          <p className="no-questionnaires">{t.noQuestionnaires}</p>
        ) : (
          <div className="questionnaire-groups">
            {Object.entries(groupedQuestionnaires).map(([title, questionnaires]) => (
              <QuestionnaireGroup
                key={`${patient.id}-${title}`}
                questionnaires={questionnaires}
                onViewResults={handleViewResults}
                onDeleteQuestionnaire={(questionnaireId) => handleDeleteQuestionnaire(questionnaireId)}
                onCopyLink={handleCopyLink}
              />
            ))}
          </div>
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

      {/* Results Modal */}
      {showResults && selectedQuestionnaireForResults && (
        <QuestionnaireResults
          questionnaire={selectedQuestionnaireForResults}
          onClose={() => setShowResults(false)}
          onEditDate={handleEditDate}
        />
      )}

      <div className="notes-section">
        <h3>{t.treatmentNotes}</h3>
        
        {isEditingNotes ? (
          <div className="notes-editor">
            <textarea 
              className="notes-textarea"
              placeholder={t.addTreatmentNotes}
              rows="4"
              value={tempNotes}
              onChange={(e) => setTempNotes(e.target.value)}
            />
            <div className="notes-actions">
              <button className="save-notes-btn" onClick={handleSaveNotes}>
                {t.saveNotes}
              </button>
              {treatmentNotes && (
                <button className="cancel-notes-btn" onClick={handleCancelNotes}>
                  {t.cancel}
                </button>
              )}
            </div>
          </div>
        ) : (
          <div className="notes-display">
            <div className="notes-content">
              {treatmentNotes}
            </div>
            <div className="notes-actions">
              <button className="edit-notes-btn" onClick={handleEditNotes}>
                {t.edit}
              </button>
              <button className="delete-notes-btn" onClick={handleDeleteNotes}>
                {t.delete}
              </button>
            </div>
          </div>
        )}
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
