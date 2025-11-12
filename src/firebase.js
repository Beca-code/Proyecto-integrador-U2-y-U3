import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDkBnQKv2RycNpxYfGwFERo4X-JYF2kfJU",
  authDomain: "proyecto1-c2a5f.firebaseapp.com",
  projectId: "proyecto1-c2a5f",
  storageBucket: "proyecto1-c2a5f.firebasestorage.app",
  messagingSenderId: "390311409801",
  appId: "1:390311409801:web:d8013102a2837360926e58"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Inicializar Firestore
const db = getFirestore(app)

export { db }