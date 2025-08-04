import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  orderBy,
  serverTimestamp 
} from 'firebase/firestore'
import { db } from '../config/firebase'

// Patients CRUD operations
export const patientsService = {
  // Get all patients
  async getAll() {
    try {
      const querySnapshot = await getDocs(
        query(collection(db, 'patients'), orderBy('createdAt', 'desc'))
      )
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching patients:', error)
      throw error
    }
  },

  // Get single patient
  async getById(id) {
    try {
      const docRef = doc(db, 'patients', id)
      const docSnap = await getDoc(docRef)
      
      if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() }
      } else {
        throw new Error('Patient not found')
      }
    } catch (error) {
      console.error('Error fetching patient:', error)
      throw error
    }
  },

  // Create new patient
  async create(patientData) {
    try {
      const docRef = await addDoc(collection(db, 'patients'), {
        ...patientData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating patient:', error)
      throw error
    }
  },

  // Update patient
  async update(id, patientData) {
    try {
      const docRef = doc(db, 'patients', id)
      await updateDoc(docRef, {
        ...patientData,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating patient:', error)
      throw error
    }
  },

  // Delete patient
  async delete(id) {
    try {
      await deleteDoc(doc(db, 'patients', id))
    } catch (error) {
      console.error('Error deleting patient:', error)
      throw error
    }
  }
}

// Questionnaires CRUD operations
export const questionnairesService = {
  // Get questionnaires for a patient
  async getByPatientId(patientId) {
    try {
      const q = query(
        collection(db, 'questionnaires'), 
        where('patientId', '==', patientId),
        orderBy('createdAt', 'desc')
      )
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (error) {
      console.error('Error fetching questionnaires:', error)
      throw error
    }
  },

  // Get questionnaire by access token
  async getByToken(token) {
    try {
      const q = query(
        collection(db, 'questionnaires'), 
        where('accessToken', '==', token)
      )
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        throw new Error('Questionnaire not found or token invalid')
      }
      
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() }
    } catch (error) {
      console.error('Error fetching questionnaire by token:', error)
      throw error
    }
  },

  // Create questionnaire
  async create(questionnaireData) {
    try {
      const docRef = await addDoc(collection(db, 'questionnaires'), {
        ...questionnaireData,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating questionnaire:', error)
      throw error
    }
  },

  // Update questionnaire (for responses)
  async update(id, data) {
    try {
      const docRef = doc(db, 'questionnaires', id)
      await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating questionnaire:', error)
      throw error
    }
  },

  // Delete questionnaire
  async delete(id) {
    try {
      await deleteDoc(doc(db, 'questionnaires', id))
    } catch (error) {
      console.error('Error deleting questionnaire:', error)
      throw error
    }
  }
}
