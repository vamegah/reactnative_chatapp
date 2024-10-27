// firebase.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyByvHyTPvwSD5iI9gFMeKk89eCoL3P__Ss",
  authDomain: "reactnative-push-notific-e871b.firebaseapp.com",
  projectId: "reactnative-push-notific-e871b",
  storageBucket: "reactnative-push-notific-e871b.appspot.com",
  messagingSenderId: "98427882719",
  appId: "1:98427882719:web:891247ae88d46914eaed6a"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
