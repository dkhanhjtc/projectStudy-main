import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAer3lMlUssHAVbCiFlrWIVm6sfrKgtti0",
  authDomain: "study-42709.firebaseapp.com",
  projectId: "study-42709",
  storageBucket: "study-42709.firebasestorage.app",
  messagingSenderId: "349198881203",
  appId: "1:349198881203:web:35bf110d82165dd6a4fbc6",
  measurementId: "G-28JPDQEGSR"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export default app;