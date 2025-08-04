import { useState, useEffect } from 'react'
import { danishTexts } from '../data/danishTexts'
import { patientsService, questionnairesService, patientQuestionnairesService } from '../services/firebaseService'
import { questionnaireService } from '../services/questionnaireService'
import { authService } from '../services/authService'
import { generateAccessToken } from '../utils/tokenUtils'
import PatientInfo from '../components/PatientInfo'
import './Overview.css'

const Overview = () => {
  const t = danishTexts
  
  // Start with empty patients array - load from Firebase
  const [patients, setPatients] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [availableQuestionnaires, setAvailableQuestionnaires] = useState([])

  // Load patients from Firebase on component mount
  useEffect(() => {
    loadPatientsFromFirebase()
    loadQuestionnaires()
  }, [])

  // Update selected patient when patients array changes (for real-time updates)
  useEffect(() => {
    if (selectedPatient && patients.length > 0) {
      const updatedSelectedPatient = patients.find(p => p.id === selectedPatient.id)
      if (updatedSelectedPatient) {
        setSelectedPatient(updatedSelectedPatient)
      }
    }
  }, [patients])

  const loadQuestionnaires = async () => {
    try {
      setLoading(true)
      
      // Load questionnaires from Firebase
      const questionnaires = await questionnaireService.getAllQuestionnaires()
      const firebaseQuestionnaires = questionnaires.map(q => ({
        id: q.id,
        title: q.title,
        description: q.description || 'Ingen beskrivelse',
        instructions: q.instructions || '',
        questions: q.questions || [],
        isTemplate: false,
        originalTemplateId: q.originalTemplateId
      }))
      
      // Remove duplicates based on title and originalTemplateId
      const uniqueQuestionnaires = firebaseQuestionnaires.filter((q, index, arr) => {
        // Keep the first occurrence of each unique questionnaire
        return index === arr.findIndex(item => 
          item.title === q.title && 
          item.originalTemplateId === q.originalTemplateId
        )
      })
      
      // If no questionnaires exist in Firebase, we need to migrate templates first
      if (uniqueQuestionnaires.length === 0) {
        console.log('No questionnaires found in Firebase. Templates need to be migrated first.')
        setError('Ingen spørgeskemaer fundet. Migrer venligst skabeloner fra Admin-panelet først.')
        setAvailableQuestionnaires([])
        return
      }
      
      console.log('Loaded questionnaires:', uniqueQuestionnaires)
      setAvailableQuestionnaires(uniqueQuestionnaires)
      
    } catch (err) {
      console.error('Failed to load questionnaires from Firebase:', err.message)
      setError('Fejl ved indlæsning af spørgeskemaer. Tjek forbindelsen til Firebase.')
      setAvailableQuestionnaires([])
    } finally {
      setLoading(false)
    }
  }

  const loadPatientsFromFirebase = async () => {
    try {
      setLoading(true)
      const firebasePatients = await patientsService.getAll()
      
      // Load questionnaires for each patient
      const patientsWithQuestionnaires = await Promise.all(
        firebasePatients.map(async (patient) => {
          try {
            const questionnaires = await patientQuestionnairesService.getByPatientId(patient.id)
            return {
              ...patient,
              questionnaires: questionnaires.map(q => ({
                id: q.id,
                title: q.title,
                date: q.assignedDate ? q.assignedDate.split('T')[0] : new Date().toISOString().split('T')[0],
                status: q.status || 'pending',
                templateId: q.templateId,
                accessToken: q.accessToken
              }))
            }
          } catch (error) {
            console.warn(`Error loading questionnaires for patient ${patient.id}:`, error)
            return { ...patient, questionnaires: [] }
          }
        })
      )
      
      setPatients(patientsWithQuestionnaires)
    } catch (err) {
      console.warn('Firebase not available:', err.message)
      setError('Fejl ved indlæsning af patienter fra Firebase.')
    } finally {
      setLoading(false)
    }
  }

  const [selectedPatient, setSelectedPatient] = useState(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [showEditForm, setShowEditForm] = useState(false)
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: '',
    phone: '',
    email: '',
    condition: '',
    selectedQuestionnaires: []
  })

  const handleSelectPatient = (patient) => {
    // Toggle functionality: if clicking the same patient, unselect it
    if (selectedPatient && selectedPatient.id === patient.id) {
      setSelectedPatient(null)
    } else {
      setSelectedPatient(patient)
    }
    setShowAddForm(false)
    setShowEditForm(false)
  }

  const handleEditPatient = (patient) => {
    setNewPatient({
      ...patient,
      selectedQuestionnaires: []
    })
    setShowEditForm(true)
    setShowAddForm(false)
    setSelectedPatient(null)
  }

  const handleAddPatient = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Create patient in Firebase first
      const patientData = {
        name: newPatient.name,
        age: parseInt(newPatient.age),
        phone: newPatient.phone,
        email: newPatient.email,
        condition: newPatient.condition
      }
      
      const patientId = await patientsService.create(patientData)
      
      // Create questionnaires for the patient if any were selected
      const createdQuestionnaires = []
      if (newPatient.selectedQuestionnaires.length > 0) {
        const currentUser = await authService.getCurrentUser()
        
        for (const templateId of newPatient.selectedQuestionnaires) {
          const template = availableQuestionnaires.find(q => q.id === templateId)
          if (template) {
            const accessToken = generateAccessToken()
            
            const questionnaireData = {
              title: template.title,
              description: template.description,
              instructions: template.instructions || '',
              questions: template.questions,
              createdBy: currentUser?.email || 'system',
              lastModifiedBy: currentUser?.email || 'system',
              accessToken: accessToken,
              patientId: patientId,
              templateId: templateId,
              status: 'pending',
              assignedDate: new Date().toISOString()
            }
            
            // Create patient questionnaire instance, not template questionnaire
            await patientQuestionnairesService.create(questionnaireData)
            
            createdQuestionnaires.push({
              title: template.title,
              status: 'pending',
              assignedDate: new Date().toISOString().split('T')[0],
              accessToken: accessToken
            })
          }
        }
      }
      
      // Reload patients from Firebase to get the updated list
      await loadPatientsFromFirebase()
      
      setNewPatient({ name: '', age: '', phone: '', email: '', condition: '', selectedQuestionnaires: [] })
      setShowAddForm(false)
      
    } catch (error) {
      console.error('Error adding patient:', error)
      setError('Fejl ved tilføjelse af patient. Prøv igen.')
    } finally {
      setLoading(false)
    }
  }

  const handleUpdatePatient = async (e) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      
      // Update patient in Firebase
      const patientData = {
        name: newPatient.name,
        age: parseInt(newPatient.age),
        phone: newPatient.phone,
        email: newPatient.email,
        condition: newPatient.condition
      }
      
      await patientsService.update(newPatient.id, patientData)
      
      // Reload patients from Firebase
      await loadPatientsFromFirebase()
      
      // Update selected patient
      const updatedPatient = patients.find(p => p.id === newPatient.id)
      if (updatedPatient) {
        setSelectedPatient(updatedPatient)
      }
      
      setNewPatient({ name: '', age: '', phone: '', email: '', condition: '', selectedQuestionnaires: [] })
      setShowEditForm(false)
      
    } catch (error) {
      console.error('Error updating patient:', error)
      setError('Fejl ved opdatering af patient. Prøv igen.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePatient = async (patientId) => {
    if (window.confirm(t.deleteConfirm)) {
      try {
        setLoading(true)
        
        // Delete patient from Firebase
        await patientsService.delete(patientId)
        
        // Also delete all questionnaires for this patient
        const patientQuestionnaires = await patientQuestionnairesService.getByPatientId(patientId)
        await Promise.all(
          patientQuestionnaires.map(q => patientQuestionnairesService.delete(q.id))
        )
        
        // Reload patients from Firebase
        await loadPatientsFromFirebase()
        
        if (selectedPatient && selectedPatient.id === patientId) {
          setSelectedPatient(null)
        }
      } catch (error) {
        console.error('Error deleting patient:', error)
        setError('Fejl ved sletning af patient. Prøv igen.')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddQuestionnaireToPatient = async (patientId, questionnaireId) => {
    try {
      setLoading(true)
      const template = availableQuestionnaires.find(q => q.id === questionnaireId)
      
      if (!template || !template.questions || template.questions.length === 0) {
        throw new Error('Template ikke fundet eller mangler spørgsmål')
      }
      
      const currentUser = await authService.getCurrentUser()
      const accessToken = generateAccessToken()
      
      // Create the actual questionnaire document in Firebase
      const questionnaireData = {
        title: template.title,
        description: template.description,
        instructions: template.instructions || '',
        questions: template.questions,
        createdBy: currentUser?.email || 'system',
        lastModifiedBy: currentUser?.email || 'system',
        accessToken: accessToken,
        patientId: patientId,
        templateId: questionnaireId,
        status: 'pending',
        assignedDate: new Date().toISOString()
      }
      
      await patientQuestionnairesService.create(questionnaireData)
      
      // Reload patients to get updated questionnaire list
      await loadPatientsFromFirebase()
      
    } catch (error) {
      console.error('Error adding questionnaire to patient:', error)
      setError('Fejl ved tilføjelse af spørgeskema. Prøv igen.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuestionnaireFromPatient = async (patientId, questionnaireId) => {
    try {
      setLoading(true)
      
      // Delete the questionnaire document from Firebase
      await patientQuestionnairesService.delete(questionnaireId)
      
      // Reload patients to get updated questionnaire list
      await loadPatientsFromFirebase()
      
    } catch (error) {
      console.error('Error deleting questionnaire:', error)
      setError('Fejl ved sletning af spørgeskema. Prøv igen.')
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    setNewPatient({
      ...newPatient,
      [e.target.name]: e.target.value
    })
  }

  const handleQuestionnaireSelection = (questionnaireId, isSelected) => {
    if (isSelected) {
      setNewPatient({
        ...newPatient,
        selectedQuestionnaires: [...newPatient.selectedQuestionnaires, questionnaireId]
      })
    } else {
      setNewPatient({
        ...newPatient,
        selectedQuestionnaires: newPatient.selectedQuestionnaires.filter(id => id !== questionnaireId)
      })
    }
  }

  return (
    <div className="overview-container">
      <div className="overview-header">
        <h1>{t.patientOverview}</h1>
        <button 
          className="add-patient-btn"
          onClick={() => {
            setShowAddForm(true)
            setSelectedPatient(null)
            setShowEditForm(false)
            setError('') // Clear any previous errors
          }}
        >
          {t.addNewPatient}
        </button>
      </div>

      {/* Error display */}
      {error && (
        <div className="error-message" style={{ 
          background: '#fee', 
          border: '1px solid #f99', 
          padding: '10px', 
          margin: '10px 0', 
          borderRadius: '4px',
          color: '#c33'
        }}>
          {error}
          <button 
            onClick={() => setError('')}
            style={{ 
              float: 'right', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              color: '#c33',
              fontSize: '16px'
            }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Loading display */}
      {loading && (
        <div className="loading-message" style={{ 
          background: '#e3f2fd', 
          border: '1px solid #2196f3', 
          padding: '10px', 
          margin: '10px 0', 
          borderRadius: '4px',
          color: '#1976d2'
        }}>
          Behandler anmodning...
        </div>
      )}

      <div className="overview-content">
        <div className="patients-list">
          <h2>{t.patients}</h2>
          <div className="patient-cards">
            {patients.map(patient => (
              <div 
                key={patient.id} 
                className={`patient-card ${selectedPatient?.id === patient.id ? 'selected' : ''}`}
                onClick={() => handleSelectPatient(patient)}
              >
                <h3>{patient.name}</h3>
                <p><strong>{t.ageLabel}:</strong> {patient.age}</p>
                <p><strong>{t.conditionLabel}:</strong> {patient.condition}</p>
                <p><strong>{t.phoneLabel}:</strong> {patient.phone}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="patient-details">
          {showAddForm || showEditForm ? (
            <div className="add-patient-form">
              <h2>{showEditForm ? t.editPatient : t.addPatient}</h2>
              <form onSubmit={showEditForm ? handleUpdatePatient : handleAddPatient}>
                <div className="form-group">
                  <label htmlFor="name">{t.fullName}</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={newPatient.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="age">{t.age}</label>
                  <input
                    type="number"
                    id="age"
                    name="age"
                    value={newPatient.age}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="phone">{t.phone}</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={newPatient.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">{t.email}</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={newPatient.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="condition">{t.condition}</label>
                  <select
                    id="condition"
                    name="condition"
                    value={newPatient.condition}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">{t.chooseCondition}</option>
                    {Object.entries(t.conditionOptions).map(([key, value]) => (
                      <option key={key} value={value}>
                        {value}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Questionnaire selection - only show when adding new patient */}
                {showAddForm && (
                  <div className="form-group">
                    <label>{t.initialQuestionnaires}</label>
                    <p className="questionnaire-description">
                      {t.questionnaireDescription}
                    </p>
                    <div className="questionnaire-checkboxes">
                      {availableQuestionnaires.map(questionnaire => (
                        <label key={questionnaire.id} className="checkbox-label">
                          <input
                            type="checkbox"
                            checked={newPatient.selectedQuestionnaires.includes(questionnaire.id)}
                            onChange={(e) => handleQuestionnaireSelection(questionnaire.id, e.target.checked)}
                          />
                          <div className="questionnaire-option">
                            <strong>{questionnaire.title}</strong>
                            <span>{questionnaire.description}</span>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="form-actions">
                  <button type="submit" className="submit-btn">
                    {showEditForm ? t.updatePatient : t.addPatient}
                  </button>
                  <button 
                    type="button" 
                    className="cancel-btn"
                    onClick={() => {
                      setShowAddForm(false)
                      setShowEditForm(false)
                      setNewPatient({ name: '', age: '', phone: '', email: '', condition: '', selectedQuestionnaires: [] })
                    }}
                  >
                    {t.cancel}
                  </button>
                </div>
              </form>
            </div>
          ) : selectedPatient ? (
            <PatientInfo 
              patient={selectedPatient} 
              onEdit={() => handleEditPatient(selectedPatient)}
              onDelete={() => handleDeletePatient(selectedPatient.id)}
              onAddQuestionnaire={handleAddQuestionnaireToPatient}
              onDeleteQuestionnaire={handleDeleteQuestionnaireFromPatient}
              availableQuestionnaires={availableQuestionnaires}
            />
          ) : (
            <div className="no-selection">
              <p>{t.selectPatientMessage}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Overview
