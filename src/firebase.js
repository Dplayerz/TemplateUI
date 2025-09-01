// Import the functions you need from the SDKs you need
import { getAuth } from "firebase/auth";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyASHtjr2Nfu7sM1d4XmI8Ef7ZVk2tpxRDY",
  authDomain: "rfidcreds.firebaseapp.com",
  projectId: "rfidcreds",
  storageBucket: "rfidcreds.firebasestorage.app",
  messagingSenderId: "784784097134",
  appId: "1:784784097134:web:dfc8ead53d7211f2490b7f",
  measurementId: "G-VML6B0QG83"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);