// Predefined questionnaire templates
export const questionnaireTemplates = {
  'who5': {
    id: 'who5',
    title: 'WHO-5 Well-Being Index',
    description: 'Measures psychological well-being over the past two weeks',
    instructions: 'Please indicate for each of the five statements which is closest to how you have been feeling over the last two weeks.',
    questions: [
      {
        id: 1,
        type: 'scale',
        question: 'I have felt cheerful and in good spirits',
        min: 0,
        max: 5,
        labels: ['At no time', 'Some of the time', 'Less than half of the time', 'More than half of the time', 'Most of the time', 'All of the time'],
        required: true
      },
      {
        id: 2,
        type: 'scale',
        question: 'I have felt calm and relaxed',
        min: 0,
        max: 5,
        labels: ['At no time', 'Some of the time', 'Less than half of the time', 'More than half of the time', 'Most of the time', 'All of the time'],
        required: true
      },
      {
        id: 3,
        type: 'scale',
        question: 'I have felt active and vigorous',
        min: 0,
        max: 5,
        labels: ['At no time', 'Some of the time', 'Less than half of the time', 'More than half of the time', 'Most of the time', 'All of the time'],
        required: true
      },
      {
        id: 4,
        type: 'scale',
        question: 'I woke up feeling fresh and rested',
        min: 0,
        max: 5,
        labels: ['At no time', 'Some of the time', 'Less than half of the time', 'More than half of the time', 'Most of the time', 'All of the time'],
        required: true
      },
      {
        id: 5,
        type: 'scale',
        question: 'My daily life has been filled with things that interest me',
        min: 0,
        max: 5,
        labels: ['At no time', 'Some of the time', 'Less than half of the time', 'More than half of the time', 'Most of the time', 'All of the time'],
        required: true
      }
    ]
  },
  
  'pain-scale': {
    id: 'pain-scale',
    title: 'Pain Assessment Scale',
    description: 'Comprehensive pain evaluation questionnaire',
    instructions: 'Please answer the following questions about your pain experience.',
    questions: [
      {
        id: 1,
        type: 'scale',
        question: 'Rate your pain right now on a scale from 0-10',
        min: 0,
        max: 10,
        labels: ['No pain', 'Worst pain imaginable'],
        required: true
      },
      {
        id: 2,
        type: 'scale',
        question: 'Rate your average pain over the past week on a scale from 0-10',
        min: 0,
        max: 10,
        labels: ['No pain', 'Worst pain imaginable'],
        required: true
      },
      {
        id: 3,
        type: 'multiple-choice',
        question: 'How would you describe your pain?',
        options: [
          'Sharp/stabbing',
          'Dull/aching',
          'Burning',
          'Throbbing',
          'Cramping',
          'Other'
        ],
        required: true
      },
      {
        id: 4,
        type: 'checkbox',
        question: 'What makes your pain worse? (Select all that apply)',
        options: [
          'Movement',
          'Sitting',
          'Standing',
          'Walking',
          'Lying down',
          'Stress',
          'Weather changes',
          'Physical activity'
        ],
        required: false
      },
      {
        id: 5,
        type: 'textarea',
        question: 'Please describe how pain affects your daily activities',
        required: false
      }
    ]
  },

  'initial-health': {
    id: 'initial-health',
    title: 'Initial Health Assessment',
    description: 'General health and medical history questionnaire',
    instructions: 'Please provide accurate information about your health history to help us provide the best treatment.',
    questions: [
      {
        id: 1,
        type: 'text',
        question: 'What is your main health concern or reason for seeking acupuncture treatment?',
        required: true
      },
      {
        id: 2,
        type: 'multiple-choice',
        question: 'How long have you been experiencing this condition?',
        options: [
          'Less than 1 week',
          '1-4 weeks',
          '1-3 months',
          '3-6 months',
          '6-12 months',
          'More than 1 year'
        ],
        required: true
      },
      {
        id: 3,
        type: 'checkbox',
        question: 'Do you have any of the following conditions? (Select all that apply)',
        options: [
          'Diabetes',
          'High blood pressure',
          'Heart disease',
          'Arthritis',
          'Depression/Anxiety',
          'Chronic pain',
          'Sleep disorders',
          'Digestive issues'
        ],
        required: false
      },
      {
        id: 4,
        type: 'text',
        question: 'Please list any medications you are currently taking:',
        required: false
      },
      {
        id: 5,
        type: 'multiple-choice',
        question: 'Have you had acupuncture treatment before?',
        options: [
          'Never',
          'Once',
          'A few times',
          'Many times',
          'Regular treatments'
        ],
        required: true
      }
    ]
  },

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
  }
}

export default questionnaireTemplates
