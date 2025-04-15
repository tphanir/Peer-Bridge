// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDUbyvj4vBC7Bg7NiO6yM21Fh9Jww4rk-U",
  authDomain: "peer-bridge-3aa05.firebaseapp.com",
  projectId: "peer-bridge-3aa05",
  storageBucket: "peer-bridge-3aa05.firebasestorage.app",
  messagingSenderId: "1049270125776",
  appId: "1:1049270125776:web:f9cc07110bcc937e1a0ad5",
  measurementId: "G-G5TY941JRD"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider };
