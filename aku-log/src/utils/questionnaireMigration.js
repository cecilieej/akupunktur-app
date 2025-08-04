// Migration script to transfer questionnaire templates to Firestore
// This is a one-time setup script

import { questionnaireService } from '../services/questionnaireService'
import { questionnaireTemplates } from '../data/questionnaireTemplates'

export const migrateQuestionnaireTemplates = async () => {
  console.log('Starting questionnaire template migration...')
  
  try {
    const migrations = Object.entries(questionnaireTemplates).map(async ([key, template]) => {
      const questionnaireData = {
        title: template.title,
        description: template.description || template.instructions,
        questions: template.questions,
        originalTemplateId: key,
        createdBy: 'system-migration',
        isMigrated: true
      }
      
      console.log(`Migrating: ${template.title}`)
      const id = await questionnaireService.createQuestionnaire(questionnaireData)
      console.log(`✅ Migrated: ${template.title} (ID: ${id})`)
      
      return { key, id, title: template.title }
    })
    
    const results = await Promise.all(migrations)
    
    console.log('Migration completed successfully!')
    console.log('Migrated questionnaires:', results)
    
    return results
  } catch (error) {
    console.error('Migration failed:', error)
    throw error
  }
}

// Function to check if templates are already migrated
export const checkMigrationStatus = async () => {
  try {
    const questionnaires = await questionnaireService.getAllQuestionnaires()
    const migratedCount = questionnaires.filter(q => q.isMigrated).length
    const templateCount = Object.keys(questionnaireTemplates).length
    
    return {
      hasMigrated: migratedCount > 0,
      migratedCount,
      templateCount,
      needsMigration: migratedCount < templateCount
    }
  } catch (error) {
    console.error('Error checking migration status:', error)
    return {
      hasMigrated: false,
      migratedCount: 0,
      templateCount: Object.keys(questionnaireTemplates).length,
      needsMigration: true
    }
  }
}
