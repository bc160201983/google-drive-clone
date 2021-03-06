import { initializeApp, getApps, getApp } from "firebase/app";
import { collection, getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,

  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
};

const app = getApps.length > 0 ? getApp : initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);

export const database = {
  folders: collection(db, "folders"),
  files: collection(db, "files"),
  formatData: (doc) => {
    return { ...doc.data(), id: doc.id };
  },
};
export const auth = getAuth(app);
