// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCSPGP0EweFpdiJnLngLp0rp0OUC7EepHo",
  authDomain: "chordmate-5cf32.firebaseapp.com",
  projectId: "chordmate-5cf32",
  storageBucket: "chordmate-5cf32.firebasestorage.app",
  messagingSenderId: "553046307845",
  appId: "1:553046307845:web:9fb7ee62e4d0ce5318586c",
  measurementId: "G-WWYPTS6DSL"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);