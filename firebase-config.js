import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyA7YvOjIOk-TXZGKihGEt0nVLon546PQj0",
  authDomain: "drew-store.firebaseapp.com",
  projectId: "drew-store",
  storageBucket: "drew-store.firebasestorage.app",
  messagingSenderId: "850749973359",
  appId: "1:850749973359:web:cebe4fe7b1db345b713e9a"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
