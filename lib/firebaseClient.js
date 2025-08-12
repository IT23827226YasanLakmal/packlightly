import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCnzmYvFMSY-kw7_8j1HOEH5ruyDr5mzlk",
  authDomain: "packlightly.firebaseapp.com",
  projectId: "packlightly",
  storageBucket: "packlightly.firebasestorage.app",
  messagingSenderId: "370287388556",
  appId: "1:370287388556:web:371294867f47c61726d8a9",
  measurementId: "G-5PVHC7DT02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
