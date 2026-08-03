import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDOn3upFszXxm6PMhDEfgel9NugrHYQKCY",
  authDomain: "my-contractor-manager.firebaseapp.com",
  projectId: "my-contractor-manager",
  storageBucket: "my-contractor-manager.firebasestorage.app",
  messagingSenderId: "1081835787972",
  appId: "1:1081835787972:web:b22c9bde8c8c604cbf9b91",
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);

export default app;