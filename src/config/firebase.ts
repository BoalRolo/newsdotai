import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDeA9WJ9h-an3mmw-Fn8w0P0-Z4kcGHcEA",
  authDomain: "newsdotai-database.firebaseapp.com",
  projectId: "newsdotai-database",
  storageBucket: "newsdotai-database.firebasestorage.app",
  messagingSenderId: "235389527224",
  appId: "1:235389527224:web:98d478aea2b9717410404d",
  measurementId: "G-1MJTLMM13M"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
