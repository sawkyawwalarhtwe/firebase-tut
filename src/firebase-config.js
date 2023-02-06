import { initializeApp } from "firebase/app";
import {getFirestore} from '@firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyAGpTAtDEhaGjbJ5rYzB8P5zL9b_bRPOGY",
    authDomain: "krost-firebase-tutorial.firebaseapp.com",
    projectId: "krost-firebase-tutorial",
    storageBucket: "krost-firebase-tutorial.appspot.com",
    messagingSenderId: "542242429003",
    appId: "1:542242429003:web:a67d8349918eeca93515ce",
    measurementId: "G-2J8JFWDJW4"
  };
  
  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  export const db = getFirestore();