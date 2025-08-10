// Implemented by Gemini
import { initializeApp, getApps, getApp, FirebaseApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Ключ API, предоставленный пользователем.
export const firebaseConfig = {
  apiKey: "AIzaSyBpRD4Zrfm34l5f0tYz8FGBaHSdmtJo72g",
  authDomain: "centswap.firebaseapp.com",
  projectId: "centswap",
  storageBucket: "centswap.appspot.com",
  messagingSenderId: "507386719982",
  appId: "1:507386719982:web:f5f28abb86332645dfcdff",
};


// Initialize Firebase
let app: FirebaseApp;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
