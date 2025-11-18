// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCehIQSisBYC-4mwkCPbIbdRXRaC3ccv0c",
  authDomain: "rongai-church-youth-app.firebaseapp.com",
  projectId: "rongai-church-youth-app",
  storageBucket: "rongai-church-youth-app.firebasestorage.app",
  messagingSenderId: "442227297289",
  appId: "1:442227297289:web:0dfa4adfbbd09cb5d97cd8",
  measurementId: "G-YLDF9QVQS9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
export const db = getFirestore(app);

// Initialize Cloud Functions
export const functions = getFunctions(app);

export default app;