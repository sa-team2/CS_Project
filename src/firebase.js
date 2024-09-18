// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyB6_JoKy3UXOZDKlCPWMXPleX_Vlqwb05M",
    authDomain: "dayofftest1.firebaseapp.com",
    databaseURL: "https://dayofftest1-default-rtdb.firebaseio.com",
    projectId: "dayofftest1",
    storageBucket: "dayofftest1.appspot.com",
    messagingSenderId: "827520348559",
    appId: "1:827520348559:web:e6f0d2de638db932a19bfa"
  };

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };
