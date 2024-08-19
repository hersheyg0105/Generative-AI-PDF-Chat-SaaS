import { getApp, getApps, initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB3zxnhSor6LlM_hZEAjEE3EIKdT7VNhAA",
  authDomain: "chat-with-pdf-7156d.firebaseapp.com",
  projectId: "chat-with-pdf-7156d",
  storageBucket: "chat-with-pdf-7156d.appspot.com",
  messagingSenderId: "1058350765308",
  appId: "1:1058350765308:web:f3993351d7ad49722af379",
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

const db = getFirestore(app);
const storage = getStorage(app);

export { db, storage };
