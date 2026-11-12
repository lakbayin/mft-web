import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDTx4QDE7opjVT0qZ3WqR_pkhnExi4Kt04",
  authDomain: "beh-kain-kita.firebaseapp.com",
  projectId: "beh-kain-kita",
  storageBucket: "beh-kain-kita.firebasestorage.app",
  messagingSenderId: "835828590377",
  appId: "1:835828590377:web:d2d2879d9b20c90e1b3938",
  measurementId: "G-1B2PW8TNFX",
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
