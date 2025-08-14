import { useState } from 'react'
import * as XLSX from 'xlsx'
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

  const handleExportToExcel = () => {
    try {
      // Filter completed questionnaires
      const completedQuestionnaires = patient.questionnaires?.filter(q => q.status === 'completed') || []
      
      if (completedQuestionnaires.length === 0) {
        alert('Ingen færdige spørgeskemaer at eksportere')
        return
      }

      // Create workbook
      const wb = XLSX.utils.book_new()
      
      // Create patient info sheet
      const patientInfo = [
        ['Patient Information'],
        ['Navn', patient.name],
        ['Alder', patient.age],
        ['Telefon', patient.phone],
        ['Email', patient.email],
        ['Tilstand', patient.condition],
        ['Behandlingsnotater', treatmentNotes || 'Ingen notater'],
        [''],
        ['Spørgeskema Overblik'],
        ['Titel', 'Gennemført Dato', 'Status']
      ]
      
      // Add questionnaire overview
      completedQuestionnaires.forEach(q => {
        const completedDate = q.dateCompleted ? new Date(q.dateCompleted).toLocaleDateString('da-DK') : 'Ikke angivet'
        patientInfo.push([q.title, completedDate, 'Gennemført'])
      })
      
      const patientWs = XLSX.utils.aoa_to_sheet(patientInfo)
      XLSX.utils.book_append_sheet(wb, patientWs, 'Patient Info')
      
      // Create individual sheets for each completed questionnaire
      completedQuestionnaires.forEach((questionnaire, index) => {
        if (!questionnaire.questions || !questionnaire.responses) return
        
        const sheetData = [
          [questionnaire.title],
          ['Gennemført:', questionnaire.dateCompleted ? new Date(questionnaire.dateCompleted).toLocaleDateString('da-DK') : 'Ikke angivet'],
          [''],
          ['Spørgsmål', 'Svar']
        ]
        
        questionnaire.questions.forEach((question, qIndex) => {
          const answer = questionnaire.responses[question.id]
          let formattedAnswer = answer || 'Intet svar'
          
          // Format answers based on question type
          if (question.type === 'scale' && answer !== undefined) {
            formattedAnswer = answer.toString()
          } else if (Array.isArray(answer)) {
            formattedAnswer = answer.join(', ')
          }
          
          sheetData.push([
            `${qIndex + 1}. ${question.question}`,
            formattedAnswer
          ])
        })
        
        const ws = XLSX.utils.aoa_to_sheet(sheetData)
        // Create safe sheet name (Excel has 31 char limit)
        const sheetName = questionnaire.title.substring(0, 25) + (index > 0 ? ` (${index + 1})` : '')
        XLSX.utils.book_append_sheet(wb, ws, sheetName)
      })
      
      // Generate filename with current date
      const today = new Date().toISOString().split('T')[0]
      const filename = `${patient.name}_sporgeskemaer_${today}.xlsx`
      
      // Download file
      XLSX.writeFile(wb, filename)
      
    } catch (error) {
      console.error('Error exporting to Excel:', error)
      alert('Fejl ved eksport til Excel')
    }
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
          <div className="questionnaire-actions-row">
            <button 
              className="add-questionnaire-btn"
              onClick={() => setShowAddQuestionnaire(true)}
            >
              {t.createNewQuestionnaire}
            </button>
            <button 
              className="export-excel-btn"
              onClick={handleExportToExcel}
              disabled={!patient.questionnaires?.some(q => q.status === 'completed')}
            >
              {t.exportToExcel}
            </button>
          </div>
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
