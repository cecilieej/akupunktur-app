import { useState, useEffect } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import { authService } from '../../services/authService'
import { questionnaireService } from '../../services/questionnaireService'
import QuestionEditor from '../../components/QuestionEditor'
import QuestionTypeSelector from '../../components/QuestionTypeSelector'
import './QuestionnaireEditor.css'

// Simple inline function for Phase 1
const createSimpleQuestion = (type, id) => ({
  id: id || Date.now(),
  type: type || 'text',
  question: '',
  required: true
})

const QuestionnaireEditor = () => {
  const { id } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const isEditing = id && id !== 'create'
  
  const [questionnaire, setQuestionnaire] = useState({
    title: '',
    description: '',
    instructions: '',
    questions: []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)
  const [showTypeSelector, setShowTypeSelector] = useState(false)

  // Check if user is admin
  useEffect(() => {
    const user = authService.getCurrentUser()
    if (!user || user.role !== 'admin') {
      navigate('/overview')
      return
    }

    if (isEditing && !location.state?.questionnaire) {
      loadQuestionnaire()
    } else if (location.state?.questionnaire) {
      // Pre-populate with template data
      setQuestionnaire(location.state.questionnaire)
    }
  }, [id, isEditing, navigate, location.state])

  const loadQuestionnaire = async () => {
    try {
      setLoading(true)
      setError('')
      
      if (location.state?.questionnaire) {
        setQuestionnaire(location.state.questionnaire)
      } else {
        const data = await questionnaireService.getQuestionnaireById(id)
        setQuestionnaire(data)
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setSaving(true)
      setError('')

      if (!questionnaire.title.trim()) {
        throw new Error('Titel er påkrævet')
      }

      if (questionnaire.questions.length === 0) {
        throw new Error('Mindst ét spørgsmål er påkrævet')
      }

      const questionnaireData = {
        title: questionnaire.title.trim(),
        description: questionnaire.description.trim(),
        instructions: questionnaire.instructions.trim() || '',
        questions: questionnaire.questions,
        lastModifiedBy: authService.getCurrentUser()?.email
      }

      if (isEditing && !questionnaire.isTemplate) {
        await questionnaireService.updateQuestionnaire(id, questionnaireData)
      } else {
        await questionnaireService.createQuestionnaire({
          ...questionnaireData,
          createdBy: authService.getCurrentUser()?.email
        })
      }

      navigate('/admin/questionnaires')
    } catch (err) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleQuestionChange = (index, updatedQuestion) => {
    const updatedQuestions = [...questionnaire.questions]
    updatedQuestions[index] = updatedQuestion
    setQuestionnaire({
      ...questionnaire,
      questions: updatedQuestions
    })
  }

  const addQuestion = (newQuestion) => {
    setQuestionnaire({
      ...questionnaire,
      questions: [...questionnaire.questions, newQuestion]
    })
  }

  const removeQuestion = (index) => {
    const updatedQuestions = questionnaire.questions.filter((_, i) => i !== index)
    setQuestionnaire({
      ...questionnaire,
      questions: updatedQuestions
    })
  }

  const moveQuestion = (index, direction) => {
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= questionnaire.questions.length) return

    const updatedQuestions = [...questionnaire.questions]
    const temp = updatedQuestions[index]
    updatedQuestions[index] = updatedQuestions[newIndex]
    updatedQuestions[newIndex] = temp

    setQuestionnaire({
      ...questionnaire,
      questions: updatedQuestions
    })
  }

  if (loading) {
    return (
      <div className="questionnaire-editor">
        <div className="loading">Indlæser spørgeskema...</div>
      </div>
    )
  }

  return (
    <div className="questionnaire-editor">
      <div className="editor-header">
        <h1>
          {isEditing ? `Rediger: ${questionnaire.title}` : 'Opret Nyt Spørgeskema'}
        </h1>
        <div className="header-actions">
          <button 
            className="btn btn-secondary"
            onClick={() => navigate('/admin/questionnaires')}
          >
            Annuller
          </button>
          <button 
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'Gemmer...' : 'Gem'}
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="editor-content">
        <div className="basic-info">
          <div className="form-group">
            <label htmlFor="title">Titel *</label>
            <input
              type="text"
              id="title"
              value={questionnaire.title}
              onChange={(e) => setQuestionnaire({
                ...questionnaire,
                title: e.target.value
              })}
              placeholder="Indtast spørgeskema titel"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="description">Beskrivelse</label>
            <textarea
              id="description"
              value={questionnaire.description}
              onChange={(e) => setQuestionnaire({
                ...questionnaire,
                description: e.target.value
              })}
              placeholder="Kort beskrivelse af spørgeskemaet"
              rows={2}
            />
          </div>

          <div className="form-group">
            <label htmlFor="instructions">Instruktioner</label>
            <textarea
              id="instructions"
              value={questionnaire.instructions}
              onChange={(e) => setQuestionnaire({
                ...questionnaire,
                instructions: e.target.value
              })}
              placeholder="Detaljerede instruktioner til patienten (valgfrit)"
              rows={3}
            />
          </div>
        </div>

        <div className="questions-section">
          <div className="section-header">
            <h2>Spørgsmål ({questionnaire.questions.length})</h2>
            {questionnaire.questions.length > 0 && (
              <button 
                className="btn btn-primary"
                onClick={() => setShowTypeSelector(true)}
              >
                + Tilføj Spørgsmål
              </button>
            )}
          </div>

          {questionnaire.questions.map((question, index) => (
            <QuestionEditor
              key={question.id || index}
              question={question}
              questionNumber={index + 1}
              onUpdate={(updatedQuestion) => handleQuestionChange(index, updatedQuestion)}
              onDelete={() => removeQuestion(index)}
              onMoveUp={() => moveQuestion(index, 'up')}
              onMoveDown={() => moveQuestion(index, 'down')}
              canMoveUp={index > 0}
              canMoveDown={index < questionnaire.questions.length - 1}
            />
          ))}

          {questionnaire.questions.length === 0 && (
            <div className="empty-questions">
              <p>Ingen spørgsmål endnu.</p>
              <button 
                className="btn btn-primary"
                onClick={() => setShowTypeSelector(true)}
              >
                Tilføj et spørgsmål
              </button>
            </div>
          )}

          {questionnaire.questions.length > 0 && (
            <div className="add-question-bottom">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => setShowTypeSelector(true)}
              >
                + Tilføj Nyt Spørgsmål
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Question Type Selector Modal */}
      {showTypeSelector && (
        <QuestionTypeSelector
          onAddQuestion={addQuestion}
          onClose={() => setShowTypeSelector(false)}
        />
      )}
    </div>
  )
}

export default QuestionnaireEditor
