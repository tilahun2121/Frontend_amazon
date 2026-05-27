
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDxqtQSmZGmOxxvEKxWpFEcLTRg9l4h87s",
  authDomain: "clone-e6ceb.firebaseapp.com",
  projectId: "clone-e6ceb",
  storageBucket: "clone-e6ceb.firebasestorage.app",
  messagingSenderId: "919324154904",
  appId: "1:919324154904:web:0fc75bbee7cf08908fb76d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);