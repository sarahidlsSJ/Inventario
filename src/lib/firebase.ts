import { initializeApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB7nhbbQ6Aiwu-FPAtIznnyu6EXFpuQkrY",
  authDomain: "inventario-sj.firebaseapp.com",
  projectId: "inventario-sj",
  storageBucket: "inventario-sj.firebasestorage.app",
  messagingSenderId: "875641384916",
  appId: "1:875641384916:web:01195c2225cdbc63f4b041"
};

const app =
  getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApps()[0];

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;