// Predefined questionnaire templates
export const questionnaireTemplates = {
    'treatment-progress': {
    id: 'treatment-progress',
    title: 'Treatment Progress Review',
    description: 'Progress tracking questionnaire for ongoing treatment',
    instructions: 'Please reflect on your progress since your last treatment session.',
    questions: [
      {
        id: 1,
        type: 'scale',
        question: 'How would you rate your overall improvement since starting treatment?',
        min: 1,
        max: 10,
        labels: ['No improvement', 'Significant improvement'],
        required: true
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'How has your main symptom changed since the last session?',
        options: [
          'Much better',
          'Somewhat better',
          'No change',
          'Somewhat worse',
          'Much worse'
        ],
        required: true
      },
      {
        id: 3,
        type: 'checkbox',
        question: 'Which areas have shown improvement? (Select all that apply)',
        options: [
          'Pain level',
          'Sleep quality',
          'Energy levels',
          'Mood',
          'Mobility',
          'Stress levels',
          'Appetite',
          'Overall well-being'
        ],
        required: false
      },
      {
        id: 4,
        type: 'textarea',
        question: 'Please describe any changes or new symptoms you have experienced',
        required: false
      }
    ]
  },

  'lifestyle': {
    id: 'lifestyle',
    title: 'Lifestyle Assessment',
    description: 'Diet, exercise, and lifestyle habits evaluation',
    instructions: 'This information helps us understand factors that may affect your treatment.',
    questions: [
      {
        id: 1,
        type: 'multiple-choice',
        question: 'How would you describe your current stress level?',
        options: [
          'Very low',
          'Low',
          'Moderate',
          'High',
          'Very high'
        ],
        required: true
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'How many hours of sleep do you typically get per night?',
        options: [
          'Less than 5 hours',
          '5-6 hours',
          '6-7 hours',
          '7-8 hours',
          '8-9 hours',
          'More than 9 hours'
        ],
        required: true
      },
      {
        id: 3,
        type: 'checkbox',
        question: 'What types of exercise do you regularly do? (Select all that apply)',
        options: [
          'Walking',
          'Running/Jogging',
          'Swimming',
          'Cycling',
          'Yoga/Pilates',
          'Weight training',
          'Sports',
          'None'
        ],
        required: false
      },
      {
        id: 4,
        type: 'multiple-choice',
        question: 'How would you describe your diet?',
        options: [
          'Very healthy',
          'Mostly healthy',
          'Average',
          'Somewhat unhealthy',
          'Very unhealthy'
        ],
        required: true
      }
    ]
  },
}

export default questionnaireTemplates
