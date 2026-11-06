import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPcUzPNU-ZB1uo-1Is0IZY1oW5bpUIVCk",
  authDomain: "inventario-5e1bf.firebaseapp.com",
  projectId: "inventario-5e1bf",
  storageBucket: "inventario-5e1bf.firebasestorage.app",
  messagingSenderId: "562580961195",
  appId: "1:562580961195:web:c3d53652b04c92873dc4ee"
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;