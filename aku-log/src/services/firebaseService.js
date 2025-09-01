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
  // Get all patients (admin only) or assigned patients (employees)
  async getAll(userRole = null, employeeId = null) {
    try {
      let querySnapshot
      
      // If employee role and employeeId provided, filter by assignedTo
      if (userRole === 'employee' && employeeId) {
        const q = query(
          collection(db, 'patients'),
          where('assignedTo', '==', employeeId)
        )
        querySnapshot = await getDocs(q)
      } else {
        // Admin can get all patients
        querySnapshot = await getDocs(collection(db, 'patients'))
      }
      
      const patients = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // Sort manually by createdAt if available
      return patients.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(0)
        const bTime = b.createdAt?.toDate?.() || new Date(0)
        return bTime - aTime
      })
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
        where('patientId', '==', patientId)
      )
      const querySnapshot = await getDocs(q)
      const questionnaires = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // Sort manually by createdAt if available
      return questionnaires.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.assignedDate || 0)
        const bTime = b.createdAt?.toDate?.() || new Date(b.assignedDate || 0)
        return bTime - aTime
      })
    } catch (error) {
      console.error('Error fetching questionnaires:', error)
      throw error
    }
  },

  // Get questionnaire by access token - now searches in patient-questionnaires
  async getByToken(token) {
    try {
      const q = query(
        collection(db, 'patient-questionnaires'), 
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
  }
}

// Patient Questionnaire Instances CRUD operations
export const patientQuestionnairesService = {
  // Get questionnaires for a patient
  async getByPatientId(patientId) {
    try {
      const q = query(
        collection(db, 'patient-questionnaires'), 
        where('patientId', '==', patientId)
      )
      const querySnapshot = await getDocs(q)
      const questionnaires = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      
      // Sort manually by createdAt if available
      return questionnaires.sort((a, b) => {
        const aTime = a.createdAt?.toDate?.() || new Date(a.assignedDate || 0)
        const bTime = b.createdAt?.toDate?.() || new Date(b.assignedDate || 0)
        return bTime - aTime
      })
    } catch (error) {
      console.error('Error fetching patient questionnaires:', error)
      throw error
    }
  },

  // Create a patient questionnaire instance
  async create(questionnaireData) {
    try {
      const docRef = await addDoc(collection(db, 'patient-questionnaires'), {
        ...questionnaireData,
        createdAt: serverTimestamp(),
        lastModified: serverTimestamp()
      })
      return docRef.id
    } catch (error) {
      console.error('Error creating patient questionnaire:', error)
      throw error
    }
  },

  // Update patient questionnaire (for storing responses)
  async update(id, updates) {
    try {
      const docRef = doc(db, 'patient-questionnaires', id)
      await updateDoc(docRef, {
        ...updates,
        lastModified: serverTimestamp()
      })
    } catch (error) {
      console.error('Error updating patient questionnaire:', error)
      throw error
    }
  },

  // Delete patient questionnaire
  async delete(id) {
    try {
      await deleteDoc(doc(db, 'patient-questionnaires', id))
    } catch (error) {
      console.error('Error deleting patient questionnaire:', error)
      throw error
    }
  },

  // Get questionnaire by access token
  async getByToken(token) {
    try {
      const q = query(
        collection(db, 'patient-questionnaires'), 
        where('accessToken', '==', token)
      )
      const querySnapshot = await getDocs(q)
      
      if (querySnapshot.empty) {
        // Also check the old collection in case there are legacy questionnaires
        const legacyQ = query(
          collection(db, 'questionnaires'), 
          where('accessToken', '==', token)
        )
        const legacySnapshot = await getDocs(legacyQ)
        
        if (!legacySnapshot.empty) {
          const doc = legacySnapshot.docs[0]
          return { id: doc.id, ...doc.data() }
        }
        
        throw new Error('Questionnaire not found or token invalid')
      }
      
      const doc = querySnapshot.docs[0]
      return { id: doc.id, ...doc.data() }
    } catch (error) {
      console.error('Error fetching questionnaire by token:', error)
      throw error
    }
  }
}
