// Firestore service for questionnaire management
import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  orderBy, 
  query,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

const QUESTIONNAIRES_COLLECTION = 'questionnaires'

export const questionnaireService = {
  // Get all questionnaires
  async getAllQuestionnaires() {
    try {
      const q = query(
        collection(db, QUESTIONNAIRES_COLLECTION),
        orderBy('title', 'asc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching questionnaires:', error)
      throw new Error('Fejl ved hentning af spørgeskemaer')
    }
  },

  // Get questionnaire by ID
  async getQuestionnaireById(id) {
    try {
      const docRef = doc(db, QUESTIONNAIRES_COLLECTION, id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return {
          id: docSnap.id,
          ...docSnap.data()
        }
      } else {
        throw new Error('Spørgeskema ikke fundet')
      }
    } catch (error) {
      console.error('Error fetching questionnaire:', error)
      throw new Error('Fejl ved hentning af spørgeskema')
    }
  },

  // Create new questionnaire
  async createQuestionnaire(questionnaire) {
    try {
      // Ensure title is the first field for better Firebase console display
      const questionnaireWithTimestamp = {
        title: questionnaire.title,
        description: questionnaire.description,
        questions: questionnaire.questions,
        createdBy: questionnaire.createdBy,
        lastModifiedBy: questionnaire.lastModifiedBy,
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp(),
        ...questionnaire  // Include any additional fields
      }
      
      const docRef = await addDoc(
        collection(db, QUESTIONNAIRES_COLLECTION),
        questionnaireWithTimestamp
      )
      
      return docRef.id
    } catch (error) {
      console.error('Error creating questionnaire:', error)
      throw new Error('Fejl ved oprettelse af spørgeskema')
    }
  },

  // Update questionnaire
  async updateQuestionnaire(id, updates) {
    try {
      const docRef = doc(db, QUESTIONNAIRES_COLLECTION, id)
      // Ensure title is the first field for better Firebase console display
      const updateData = {
        title: updates.title,
        description: updates.description,
        questions: updates.questions,
        lastModifiedBy: updates.lastModifiedBy,
        lastModified: serverTimestamp(),
        ...updates  // Include any additional fields
      }
      
      await updateDoc(docRef, updateData)
    } catch (error) {
      console.error('Error updating questionnaire:', error)
      throw new Error('Fejl ved opdatering af spørgeskema')
    }
  },

  // Delete questionnaire
  async deleteQuestionnaire(id) {
    try {
      const docRef = doc(db, QUESTIONNAIRES_COLLECTION, id)
      await deleteDoc(docRef)
    } catch (error) {
      console.error('Error deleting questionnaire:', error)
      throw new Error('Fejl ved sletning af spørgeskema')
    }
  }
}
