// Simplified question types for Phase 1 deployment
export const questionTypes = {
  'scale': {
    label: 'Skala',
    description: 'Numerisk skala (fx 1-10)',
    icon: '📊'
  },
  'multiple-choice': {
    label: 'Multiple Choice',
    description: 'Vælg én mulighed',
    icon: '🔘'
  },
  'text': {
    label: 'Tekst',
    description: 'Kort tekst input',
    icon: '📝'
  },
  'textarea': {
    label: 'Multi-linje Tekst',
    description: 'Lang tekst område',
    icon: '📄'
  }
}

export const createDefaultQuestion = (type, id) => {
  return {
    id: id || Date.now(),
    type: type || 'text',
    question: '',
    required: true
  }
}

export const validateQuestion = (question) => {
  const errors = []
  if (!question.question || !question.question.trim()) {
    errors.push('Question text is required')
  }
  return errors
}
