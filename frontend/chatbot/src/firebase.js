// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDHJPKbUdmdu45MtWf1wunoSqtHCtSSpGA",
  authDomain: "cloud-42617.firebaseapp.com",
  projectId: "cloud-42617",
  storageBucket: "cloud-42617.appspot.com",
  messagingSenderId: "371956445862",
  appId: "1:371956445862:web:d0c34ea4ae6a6a3e8b3a67",
  measurementId: "G-SDNE1P316B"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const storage = getStorage(app);