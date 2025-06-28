
import { initializeApp, getApp , getApps } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyB8ILqwW9d1p_P5GAsLR1AuRzxczUpmvZ4",
  authDomain: "speakpeak-76697.firebaseapp.com",
  projectId: "speakpeak-76697",
  storageBucket: "speakpeak-76697.firebasestorage.app",
  messagingSenderId: "604074426650",
  appId: "1:604074426650:web:a0630eaa530908b4462ca3",
  measurementId: "G-XJN7YBLSG2"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const auth = getAuth(app);
export const db = getFirestore(app);