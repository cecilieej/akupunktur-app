// Firebase configuration
import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { getAnalytics } from 'firebase/analytics'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBejHZsHOT2VVZvuLrbf-IVtgiyYggXjVA",
  authDomain: "akupunktur-app.firebaseapp.com",
  projectId: "akupunktur-app",
  storageBucket: "akupunktur-app.firebasestorage.app",
  messagingSenderId: "458066956871",
  appId: "1:458066956871:web:846774e4502032f05e9762",
  measurementId: "G-TPTNRMKGF3"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const db = getFirestore(app)
export const auth = getAuth(app)
export const analytics = getAnalytics(app)

export default app
