// Predefined questionnaire templates
export const questionnaireTemplates = {
  'who5': {
    id: 'who5',
    title: 'WHO-5 Well-Being Index',
    //description: 'Measures psychological well-being over the past two weeks',
    instructions: 'Sæt venligst, ved hvert af de 5 udsagn, et kryds i det felt der kommer tættest på, hvordan du har følt dig i de seneste to uger. Bemærk at et højere tal står for bedre trivsel. Eksempel: Hvis du har følt dig glad og i godt humør i lidt mere end halvdelen af tiden i de sidste to uger, så sæt krydset i feltet med 3-tallet i øverste højre hjørne.',
    questions: [
      {
        id: 1,
        type: 'scale',
        question: 'Jeg har følt mig glad og i godt humør',
        min: 0,
        max: 5,
        labels: ['På intet tidspunkt', 'Nogle gange', 'Mindre end halvdelen af tiden', 'Mere end halvdelen af tiden', 'Det meste af tiden', 'Hele tiden'],
        required: true
      }, 
      {
        id: 2,
        type: 'scale',
        question: 'Jeg har følt mig rolig og afslappet',
        min: 0,
        max: 5,
        labels: ['På intet tidspunkt', 'Nogle gange', 'Mindre end halvdelen af tiden', 'Mere end halvdelen af tiden', 'Det meste af tiden', 'Hele tiden'],
        required: true
      },
      {
        id: 3,
        type: 'scale',
        question: 'Jeg har følt mig aktiv og energisk',
        min: 0,
        max: 5,
        labels: ['På intet tidspunkt', 'Nogle gange', 'Mindre end halvdelen af tiden', 'Mere end halvdelen af tiden', 'Det meste af tiden', 'Hele tiden'],
        required: true
      },
      {
        id: 4,
        type: 'scale',
        question: 'Jeg vågnede op og følte mig frisk og udhvilet',
        min: 0,
        max: 5,
        labels: ['På intet tidspunkt', 'Nogle gange', 'Mindre end halvdelen af tiden', 'Mere end halvdelen af tiden', 'Det meste af tiden', 'Hele tiden'],
        required: true
      },
      {
        id: 5,
        type: 'scale',
        question: 'Min dagligdag har været fyldt med ting der interesserer mig',
        min: 0,
        max: 5,
        labels: ['På intet tidspunkt', 'Nogle gange', 'Mindre end halvdelen af tiden', 'Mere end halvdelen af tiden', 'Det meste af tiden', 'Hele tiden'],
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
  },

  'rbmt': {
    id: 'rbmt',
    title: 'Rivermead Behavioural Memory Test (RBMT) - Forenkling',
    description: 'Dette spørgeskema hjælper med at vurdere forskellige aspekter af din hukommelse og kognitive funktioner.',
    instructions: 'Besvar venligst alle spørgsmål så nøjagtigt som muligt baseret på dine oplevelser i de sidste 4 uger.',
    questions: [
      {
        id: 1,
        question: 'Hvor ofte glemmer du, hvor du har lagt ting?',
        type: 'multiple-choice',
        options: [
          'Aldrig eller næsten aldrig',
          'Sjældent',
          'Nogle gange',
          'Ofte',
          'Meget ofte'
        ],
        required: true
      },
      {
        id: 2,
        question: 'Hvor ofte glemmer du navne på personer, du kender godt?',
        type: 'multiple-choice',
        options: [
          'Aldrig eller næsten aldrig',
          'Sjældent',
          'Nogle gange',
          'Ofte',
          'Meget ofte'
        ],
        required: true
      },
      {
        id: 3,
        question: 'Hvor ofte mister du tråden i en samtale?',
        type: 'multiple-choice',
        options: [
          'Aldrig eller næsten aldrig',
          'Sjældent',
          'Nogle gange',
          'Ofte',
          'Meget ofte'
        ],
        required: true
      },
      {
        id: 4,
        question: 'Beskriv kort eventuelle specifikke hukommelsesproblemer, du har oplevet:',
        type: 'textarea',
        required: false
      }
    ]
  }
}

export default questionnaireTemplates
