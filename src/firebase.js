import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getDatabase } from 'firebase/database';
import { getStorage } from 'firebase/storage';

/**
 * Firebase Configuration for Pashu Care Web Platform
 * Reads dynamically from environment variables (Vite)
 * Fallback values enable local development and offline mock capabilities
 */
export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyMockKeyForPashuCareCattlePlatform2026",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "pashu-care-digital.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "pashu-care-digital",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "pashu-care-digital.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "918273645012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:918273645012:web:7890abcdef123456",
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || "https://pashu-care-digital-default-rtdb.firebaseio.com"
};

// Check if user has provided active custom Firebase credentials
export const isFirebaseConfigured = () => {
  const key = import.meta.env.VITE_FIREBASE_API_KEY;
  return Boolean(key && !key.includes('MockKey') && key.length > 10);
};

// Initialize Firebase App safely (singleton instance across fast reloads)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize core Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const rtdb = getDatabase(app);
export const storage = getStorage(app);

export default app;
