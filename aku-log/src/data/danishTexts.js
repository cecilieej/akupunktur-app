// Simplified Danish text system - single source of truth
export const danishTexts = {
  // Navigation
  patientOverview: 'Patientoversigt',
  logout: 'Log ud',
  
  // Login page
  employeeLogin: 'Medarbejder Login',
  username: 'Brugernavn',
  password: 'Adgangskode',
  login: 'Log ind',
  
  // Overview page
  addNewPatient: 'Tilføj Patient',
  patients: 'Patienter',
  selectPatientMessage: 'Vælg en patient for at se detaljer eller tilføj en ny patient',
  
  // Patient form
  addPatient: 'Tilføj Patient',
  editPatient: 'Rediger Patient',
  updatePatient: 'Opdater Patient',
  fullName: 'Fulde Navn',
  age: 'Alder',
  phone: 'Telefon',
  email: 'E-mail',
  condition: 'Tilstand',
  conditionOptions: {
    hjernerystelse: 'Hjernerystelse',
    stress: 'Stress',
    migraene: 'Migræne',
    rygsmerter: 'Rygsmerter',
    angst: 'Angst',
    sovnproblemer: 'Søvnproblemer',
    andet: 'Andet'
  },
  chooseCondition: 'Vælg tilstand...',
  initialQuestionnaires: 'Indledende Spørgeskemaer',
  questionnaireDescription: 'Vælg hvilke spørgeskemaer denne patient skal udfylde:',
  cancel: 'Annuller',
  
  // Patient info
  editPatientBtn: 'Rediger Patient',
  deletePatientBtn: 'Slet Patient',
  deleteConfirm: 'Er du sikker på, at du vil slette denne patient? Denne handling kan ikke fortrydes.',
  questionnaires: 'Spørgeskemaer',
  treatmentNotes: 'Behandlingsnotater',
  addTreatmentNotes: 'Tilføj behandlingsnotater, observationer eller plan for næste session...',
  saveNotes: 'Gem Notater',
  noQuestionnaires: 'Ingen spørgeskemaer endnu',
  createNewQuestionnaire: 'Nyt spørgeskema til patient',
  selectQuestionnaire: 'Vælg Spørgeskema',
  chooseQuestionnaire: 'Vælg et spørgeskema...',
  addQuestionnaire: 'Tilføj Spørgeskema',
  viewResults: 'Se Resultater',
  copyPatientLink: 'Kopier Link',
  deleteQuestionnaire: 'Slet',
  deleteQuestionnaireConfirm: 'Er du sikker på, at du vil slette dette spørgeskema?',
  
  // Patient card fields
  ageLabel: 'Alder',
  conditionLabel: 'Tilstand',
  phoneLabel: 'Telefon',
  
  // Questionnaire statuses
  completed: 'Gennemført',
  pending: 'Afventer',
  overdue: 'Forsinket',
  
  // Questionnaire templates
  questionnaireTemplates: {
    'who5': {
      title: 'WHO-5 Trivselsskala',
      description: 'Måler psykologisk trivsel'
    },
    'rbmt': {
      title: 'Rivermead Behavioural Memory Test (RBMT)',
      description: 'Test af hukommelse og kognitive funktioner'
    },
    'pain-scale': {
      title: 'Smerteassessmentskala',
      description: 'Omfattende smertevaluering'
    },
    'initial-health': {
      title: 'Indledende Helbredsvurdering',
      description: 'Generel sundhed og sygehistorie'
    },
    'treatment-progress': {
      title: 'Behandlingsforløb Evaluering',
      description: 'Fremskridtssporing spørgeskema'
    },
    'lifestyle': {
      title: 'Livsstilsvurdering',
      description: 'Daglige vaner og livsstil'
    }
  },

  // Authentication
  invalidCredentials: 'Ugyldige login oplysninger',
  loginRequired: 'Du skal være logget ind for at tilgå denne side',
  
  // Questionnaire system
  questionnaireLink: 'Spørgeskema Link',
  linkGenerated: 'Link genereret succesfuldt',
  linkCopied: 'Link kopieret til udklipsholder',
  expiry: 'Udløber',
  expired: 'Udløbet',
  
  // Firebase/Database
  loadingData: 'Indlæser data...',
  savingData: 'Gemmer data...',
  dataError: 'Fejl ved indlæsning af data',
  saveError: 'Fejl ved gemning af data'
}
