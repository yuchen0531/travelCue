// firebase-config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAGyEUA3wniivOmWdq66cQUSHpZLK8dcw0",
  authDomain: "traval-b67c5.firebaseapp.com",
  projectId: "traval-b67c5",
  storageBucket: "traval-b67c5.firebasestorage.app",
  messagingSenderId: "228661615333",
  appId: "1:228661615333:web:5029e11e5a8e534d2d520c",
  measurementId: "G-2WDTFECF0Y"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { db };