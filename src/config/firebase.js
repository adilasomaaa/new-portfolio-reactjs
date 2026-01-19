import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyB0Y2FBLsQ4yNFnodhtK9S7mjVtPq5x1gM",
  authDomain: "portofolio-6db9c.firebaseapp.com",
  projectId: "portofolio-6db9c",
  storageBucket: "portofolio-6db9c.firebasestorage.app",
  messagingSenderId: "683244348997",
  appId: "1:683244348997:web:cccfef1b04a64a2d24252c",
  measurementId: "G-3DRVQLQ4X1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const db = getFirestore(app);

export const auth = getAuth(app)