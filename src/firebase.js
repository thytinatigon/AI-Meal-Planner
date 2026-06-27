// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyANhbYG0os7ZIeasOXurVwUUcY2jh8LHPM",
  authDomain: "ai-meal-planner-9bb28.firebaseapp.com",
  projectId: "ai-meal-planner-9bb28",
  storageBucket: "ai-meal-planner-9bb28.firebasestorage.app",
  messagingSenderId: "800372578555",
  appId: "1:800372578555:web:49b8630f3302541350785e",
  measurementId: "G-ZNH33GYVZ2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);