// Questionnaire questions in Danish
export const questionnaireQuestions = {
  who5: {
    title: 'WHO-5 Trivselsskala',
    description: 'Dette spørgeskema måler dit psykologiske velbefindende over de sidste to uger.',
    instructions: 'For hver af de følgende udsagn, vælg venligst det tal (0-5), der bedst beskriver, hvor ofte du har haft denne følelse i løbet af de sidste to uger.',
    scale: {
      0: 'På intet tidspunkt',
      1: 'En lille del af tiden',
      2: 'Lidt under halvdelen af tiden',
      3: 'Lidt over halvdelen af tiden',
      4: 'Det meste af tiden',
      5: 'Hele tiden'
    },
    questions: [
      {
        id: 'who5_1',
        question: 'Jeg har følt mig glad og i godt humør',
        type: 'scale',
        required: true
      },
      {
        id: 'who5_2',
        question: 'Jeg har følt mig rolig og afslappet',
        type: 'scale',
        required: true
      },
      {
        id: 'who5_3',
        question: 'Jeg har følt mig energisk og aktiv',
        type: 'scale',
        required: true
      },
      {
        id: 'who5_4',
        question: 'Jeg vågnede frisk og udhvilet',
        type: 'scale',
        required: true
      },
      {
        id: 'who5_5',
        question: 'Min dagligdag har været fyldt med ting, der interesserer mig',
        type: 'scale',
        required: true
      }
    ]
  },

  rbmt: {
    title: 'Rivermead Behavioural Memory Test (RBMT) - Forenkling',
    description: 'Dette spørgeskema hjælper med at vurdere forskellige aspekter af din hukommelse og kognitive funktioner.',
    instructions: 'Besvar venligst alle spørgsmål så nøjagtigt som muligt baseret på dine oplevelser i de sidste 4 uger.',
    questions: [
      {
        id: 'rbmt_1',
        question: 'Hvor ofte glemmer du, hvor du har lagt ting?',
        type: 'multiple_choice',
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
        id: 'rbmt_2',
        question: 'Hvor ofte glemmer du navne på personer, du kender godt?',
        type: 'multiple_choice',
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
        id: 'rbmt_3',
        question: 'Hvor ofte mister du tråden i en samtale?',
        type: 'multiple_choice',
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
        id: 'rbmt_4',
        question: 'Beskriv kort eventuelle specifikke hukommelsesproblemer, du har oplevet:',
        type: 'textarea',
        required: false
      }
    ]
  },

  'pain-scale': {
    title: 'Smerteassessmentskala',
    description: 'Dette spørgeskema hjælper os med at forstå din smerteoplevelse.',
    instructions: 'Besvar venligst spørgsmålene baseret på din smerte i dag og den sidste uge.',
    questions: [
      {
        id: 'pain_1',
        question: 'På en skala fra 0-10, hvor kraftig er din smerte lige nu? (0 = ingen smerte, 10 = værst tænkelige smerte)',
        type: 'number',
        min: 0,
        max: 10,
        required: true
      },
      {
        id: 'pain_2',
        question: 'Hvor kraftig har din smerte i gennemsnit været den sidste uge?',
        type: 'number',
        min: 0,
        max: 10,
        required: true
      },
      {
        id: 'pain_3',
        question: 'Hvor har du primært smerte?',
        type: 'multiple_choice',
        options: [
          'Ryg',
          'Nakke',
          'Skulder',
          'Hofte',
          'Knæ',
          'Hoved',
          'Andet'
        ],
        required: true
      },
      {
        id: 'pain_4',
        question: 'Beskriv kort karakteren af din smerte (f.eks. dunk, skarp, brændende):',
        type: 'textarea',
        required: false
      }
    ]
  },

  'initial-health': {
    title: 'Indledende Helbredsvurdering',
    description: 'Denne vurdering hjælper os med at forstå din generelle sundhedstilstand.',
    instructions: 'Besvar venligst alle spørgsmål så detaljeret som muligt.',
    questions: [
      {
        id: 'health_1',
        question: 'Hvordan vurderer du dit generelle helbred?',
        type: 'multiple_choice',
        options: [
          'Fremragende',
          'Meget godt',
          'Godt',
          'Nogenlunde',
          'Dårligt'
        ],
        required: true
      },
      {
        id: 'health_2',
        question: 'Har du nogle kroniske sygdomme eller tilstande?',
        type: 'textarea',
        required: false
      },
      {
        id: 'health_3',
        question: 'Tager du i øjeblikket nogen medicin?',
        type: 'textarea',
        required: false
      },
      {
        id: 'health_4',
        question: 'Har du tidligere modtaget akupunkturbehandling?',
        type: 'multiple_choice',
        options: [
          'Nej, aldrig',
          'Ja, en gang',
          'Ja, få gange',
          'Ja, mange gange'
        ],
        required: true
      }
    ]
  }
}
