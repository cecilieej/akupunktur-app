import { useState, useEffect } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { translations } from '../data/translations'
import PatientInfo from '../components/PatientInfo'
import './Overview.css'

const Overview = () => {
  const { language } = useLanguage()
  const t = translations[language]
  
  // Load patients from localStorage or use default data
  const getInitialPatients = () => {
    const savedPatients = localStorage.getItem('acupuncture-patients')
    if (savedPatients) {
      return JSON.parse(savedPatients)
    }
    return [
      {
        id: 1,
        name: 'Anna Hansen',
        age: 35,
        phone: '+45 12 34 56 78',
        email: 'anna.hansen@email.com',
        condition: 'Rygsmerter',
        questionnaires: [
          { id: 1, title: 'Indledende Helbredsvurdering', date: '2024-12-01', status: 'completed' },
          { id: 2, title: 'Behandlingsforløb Evaluering', date: '2024-12-15', status: 'completed' }
        ]
      },
      {
        id: 2,
        name: 'Lars Nielsen',
        age: 42,
        phone: '98 76 54 32',
        email: 'lars.nielsen@email.com',
        condition: 'Stress og angst',
        questionnaires: [
          { id: 3, title: 'Indledende Helbredsvurdering', date: '2025-07-20', status: 'completed' },
          { id: 4, title: 'WHO-5 Trivselsskala', date: '2025-07-20', status: 'pending' }
        ]
      }
    ]
  }

  const [patients, setPatients] = useState(getInitialPatients)

  // Save patients to localStorage whenever patients change
  useEffect(() => {
    localStorage.setItem('acupuncture-patients', JSON.stringify(patients))
  }, [patients])

  // Pre-made questionnaire templates
  const availableQuestionnaires = [
    { id: 'who5', title: t.questionnaireTemplates['who5'].title, description: t.questionnaireTemplates['who5'].description },
    { id: 'rbmt', title: t.questionnaireTemplates['rbmt'].title, description: t.questionnaireTemplates['rbmt'].description },
    { id: 'pain-scale', title: t.questionnaireTemplates['pain-scale'].title, description: t.questionnaireTemplates['pain-scale'].description },
    { id: 'initial-health', title: t.questionnaireTemplates['initial-health'].title, description: t.questionnaireTemplates['initial-health'].description },
    { id: 'treatment-progress', title: t.questionnaireTemplates['treatment-progress'].title, description: t.questionnaireTemplates['treatment-progress'].description },
    { id: 'lifestyle', title: t.questionnaireTemplates['lifestyle'].title, description: t.questionnaireTemplates['lifestyle'].description }
  ]

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

  const handleAddPatient = (e) => {
    e.preventDefault()
    
    // Create questionnaires based on selected templates
    const initialQuestionnaires = newPatient.selectedQuestionnaires.map(qId => {
      const template = availableQuestionnaires.find(q => q.id === qId)
      return {
        id: Math.random().toString(36).substr(2, 9),
        title: template.title,
        date: new Date().toISOString().split('T')[0],
        status: 'pending',
        templateId: qId
      }
    })

    const patient = {
      id: patients.length + 1,
      name: newPatient.name,
      age: parseInt(newPatient.age),
      phone: newPatient.phone,
      email: newPatient.email,
      condition: newPatient.condition,
      lastVisit: new Date().toISOString().split('T')[0],
      questionnaires: initialQuestionnaires
    }
    
    setPatients([...patients, patient])
    setNewPatient({ name: '', age: '', phone: '', email: '', condition: '', selectedQuestionnaires: [] })
    setShowAddForm(false)
  }

  const handleUpdatePatient = (e) => {
    e.preventDefault()
    
    const updatedPatients = patients.map(p => 
      p.id === newPatient.id 
        ? { 
            ...newPatient, 
            age: parseInt(newPatient.age),
            questionnaires: p.questionnaires // Keep existing questionnaires
          }
        : p
    )
    
    setPatients(updatedPatients)
    setSelectedPatient(updatedPatients.find(p => p.id === newPatient.id))
    setNewPatient({ name: '', age: '', phone: '', email: '', condition: '', selectedQuestionnaires: [] })
    setShowEditForm(false)
  }

  const handleDeletePatient = (patientId) => {
    if (window.confirm(t.deleteConfirm)) {
      const updatedPatients = patients.filter(p => p.id !== patientId)
      setPatients(updatedPatients)
      if (selectedPatient && selectedPatient.id === patientId) {
        setSelectedPatient(null)
      }
    }
  }

  const handleAddQuestionnaireToPatient = (patientId, questionnaireId) => {
    const template = availableQuestionnaires.find(q => q.id === questionnaireId)
    const newQuestionnaire = {
      id: Math.random().toString(36).substr(2, 9),
      title: template.title,
      date: new Date().toISOString().split('T')[0],
      status: 'pending',
      templateId: questionnaireId
    }

    const updatedPatients = patients.map(p => 
      p.id === patientId 
        ? { ...p, questionnaires: [...(p.questionnaires || []), newQuestionnaire] }
        : p
    )
    
    setPatients(updatedPatients)
    setSelectedPatient(updatedPatients.find(p => p.id === patientId))
  }

  const handleDeleteQuestionnaireFromPatient = (patientId, questionnaireId) => {
    const updatedPatients = patients.map(p => 
      p.id === patientId 
        ? { ...p, questionnaires: p.questionnaires.filter(q => q.id !== questionnaireId) }
        : p
    )
    
    setPatients(updatedPatients)
    setSelectedPatient(updatedPatients.find(p => p.id === patientId))
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
          }}
        >
          {t.addNewPatient}
        </button>
      </div>

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
