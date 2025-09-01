import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { questionnaireService } from '../../services/questionnaireService'
import { handleFirebaseError } from '../../utils/errorHandling'
import './QuestionnaireManager.css'

const QuestionnaireManager = () => {
  const navigate = useNavigate()
  const [questionnaires, setQuestionnaires] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  // Check if user is admin
  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== 'admin') {
      navigate('/overview')
      return
    }
    
    loadQuestionnaires()
  }, [navigate])

  const loadQuestionnaires = async () => {
    try {
      setLoading(true)
      setError('')
      const firestoreQuestionnaires = await questionnaireService.getAllQuestionnaires()
      
      setQuestionnaires(firestoreQuestionnaires)
    } catch (err) {
      handleFirebaseError(err, setError, navigate)
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (questionnaire) => {
    navigate(`/admin/questionnaires/edit/${questionnaire.id}`, { 
      state: { questionnaire } 
    })
  }

  const handleDelete = async (id) => {
    try {
      await questionnaireService.deleteQuestionnaire(id)
      setDeleteConfirm(null)
      loadQuestionnaires() // Reload list
    } catch (err) {
      handleFirebaseError(err, setError, navigate)
    }
  }

  if (loading) {
    return (
      <div className="questionnaire-manager">
        <div className="loading">Indlæser spørgeskemaer...</div>
      </div>
    )
  }

  return (
    <div className="questionnaire-manager">
      <div className="manager-header">
        <h1>Admin - Spørgeskema Styring</h1>
        <button 
          className="btn btn-primary"
          onClick={() => navigate('/admin/questionnaires/create')}
        >
          Opret Nyt Spørgeskema
        </button>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="questionnaires-grid">
        {questionnaires.map((questionnaire) => (
          <div key={questionnaire.id} className="questionnaire-card">
            <div className="card-header">
              <h3>{questionnaire.title}</h3>
            </div>
            
            <div className="card-content">
              <p className="description">
                {questionnaire.description || 'Ingen beskrivelse'}
              </p>
              
              <div className="card-stats">
                <span className="stat">
                  📝 {questionnaire.questions?.length || 0} spørgsmål
                </span>
                {questionnaire.lastModified && (
                  <span className="stat">
                    🕒 Sidst ændret: {new Date(questionnaire.lastModified.toDate()).toLocaleDateString('da-DK')}
                  </span>
                )}
              </div>
            </div>
            
            <div className="card-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => handleEdit(questionnaire)}
              >
                Rediger
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => setDeleteConfirm(questionnaire.id)}
              >
                Slet
              </button>
            </div>
          </div>
        ))}
      </div>

      {questionnaires.length === 0 && !loading && (
        <div className="empty-state">
          <p>Ingen spørgeskemaer fundet.</p>
          <button 
            className="btn btn-primary"
            onClick={() => navigate('/admin/questionnaires/create')}
          >
            Opret Dit Første Spørgeskema
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Bekræft Sletning</h3>
            <p>Er du sikker på, at du vil slette dette spørgeskema? Denne handling kan ikke fortrydes.</p>
            <div className="modal-actions">
              <button 
                className="btn btn-secondary"
                onClick={() => setDeleteConfirm(null)}
              >
                Annuller
              </button>
              <button 
                className="btn btn-danger"
                onClick={() => handleDelete(deleteConfirm)}
              >
                Slet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default QuestionnaireManager
