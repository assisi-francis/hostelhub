import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

const firebaseConfig = {
  apiKey: "AIzaSyDA_sWD4qkj3lvgMPFVwet2Dsws2ci86Mo",
  authDomain: "hostelhub-app-2026.firebaseapp.com",
  projectId: "hostelhub-app-2026",
  storageBucket: "hostelhub-app-2026.firebasestorage.app",
  messagingSenderId: "369597739821",
  appId: "1:369597739821:web:87952b18450eb7f9fa59a4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
