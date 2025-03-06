// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';


const firebaseConfig = {
  apiKey: "AIzaSyBatU158y3hogMT1Qyq2Zq3c8OJwHelK8w",
  authDomain: "reactnative-push-notific-ee83b.firebaseapp.com",
  projectId: "reactnative-push-notific-ee83b",
  storageBucket: "reactnative-push-notific-ee83b.firebasestorage.app",
  messagingSenderId: "128732541059",
  appId: "1:128732541059:web:13715654ae106a6a696bb6",
  measurementId: "G-5ZV5L03PKL"
};
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);
