import {
  collection,
  doc,
  setDoc,
  getDocs,
  onSnapshot,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import { ref, set, get, onValue } from 'firebase/database';
import { db, rtdb, isFirebaseConfigured } from '../firebase';

/**
 * Firebase Integration Service for Pashu Care
 * Provides Firestore & Realtime Database synchronization for cattle, complaints,
 * alerts, adoptions, and inventory.
 */

// Save or update cow in Firebase Firestore & Realtime DB
export async function saveCowToFirebase(cowData) {
  if (!isFirebaseConfigured()) return null;
  try {
    const cowRef = doc(db, 'cows', cowData.qrId || String(Date.now()));
    await setDoc(cowRef, {
      ...cowData,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    // Also mirror to Realtime DB for fast mobile/IoT sync
    const rtdbRef = ref(rtdb, `cows/${cowData.qrId}`);
    await set(rtdbRef, cowData);
    return true;
  } catch (error) {
    console.warn('[Firebase] saveCowToFirebase notice:', error.message);
    return null;
  }
}

// Save or update complaint/challan in Firebase
export async function saveComplaintToFirebase(complaintData) {
  if (!isFirebaseConfigured()) return null;
  try {
    const id = complaintData.id || String(Date.now());
    const complaintRef = doc(db, 'complaints', id);
    await setDoc(complaintRef, {
      ...complaintData,
      id,
      updatedAt: new Date().toISOString()
    }, { merge: true });

    const rtdbRef = ref(rtdb, `complaints/${id}`);
    await set(rtdbRef, complaintData);
    return true;
  } catch (error) {
    console.warn('[Firebase] saveComplaintToFirebase notice:', error.message);
    return null;
  }
}

// Save missing animal report to Firebase
export async function saveMissingReportToFirebase(reportData) {
  if (!isFirebaseConfigured()) return null;
  try {
    const id = reportData.id || String(Date.now());
    const reportRef = doc(db, 'missingReports', id);
    await setDoc(reportRef, {
      ...reportData,
      id,
      timestamp: reportData.timestamp || new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('[Firebase] saveMissingReportToFirebase notice:', error.message);
    return null;
  }
}

// Save disease outbreak alert to Firebase
export async function saveDiseaseAlertToFirebase(alertData) {
  if (!isFirebaseConfigured()) return null;
  try {
    const id = alertData.id || String(Date.now());
    const alertRef = doc(db, 'diseaseAlerts', id);
    await setDoc(alertRef, {
      ...alertData,
      id,
      date: alertData.date || new Date().toISOString().split('T')[0]
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('[Firebase] saveDiseaseAlertToFirebase notice:', error.message);
    return null;
  }
}

// Save cattle adoption listing to Firebase
export async function saveAdoptionToFirebase(adoptionData) {
  if (!isFirebaseConfigured()) return null;
  try {
    const id = adoptionData.id || String(Date.now());
    const adoptionRef = doc(db, 'adoptions', id);
    await setDoc(adoptionRef, {
      ...adoptionData,
      id,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('[Firebase] saveAdoptionToFirebase notice:', error.message);
    return null;
  }
}

// Save emergency injured animal report to Firebase
export async function saveInjuredReportToFirebase(reportData) {
  if (!isFirebaseConfigured()) return null;
  try {
    const id = reportData.id || String(Date.now());
    const reportRef = doc(db, 'injuredReports', id);
    await setDoc(reportRef, {
      ...reportData,
      id,
      timestamp: reportData.timestamp || new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('[Firebase] saveInjuredReportToFirebase notice:', error.message);
    return null;
  }
}

// Save user profile to Firebase
export async function saveUserToFirebase(userData) {
  if (!isFirebaseConfigured()) return null;
  try {
    const phone = userData.phone || String(Date.now());
    const userRef = doc(db, 'users', phone);
    await setDoc(userRef, {
      ...userData,
      updatedAt: new Date().toISOString()
    }, { merge: true });
    return true;
  } catch (error) {
    console.warn('[Firebase] saveUserToFirebase notice:', error.message);
    return null;
  }
}

// Fetch entire state from Firestore collections if available
export async function fetchStateFromFirebase() {
  if (!isFirebaseConfigured()) return null;
  try {
    const collectionsToFetch = ['users', 'cows', 'complaints', 'missingReports', 'gaushalas', 'vets', 'diseaseAlerts', 'ambulances', 'adoptions'];
    const result = {};

    await Promise.all(
      collectionsToFetch.map(async (colName) => {
        try {
          const snap = await getDocs(collection(db, colName));
          result[colName] = snap.docs.map(d => ({ ...d.data(), id: d.id }));
        } catch {
          result[colName] = [];
        }
      })
    );

    return result;
  } catch (error) {
    console.warn('[Firebase] fetchStateFromFirebase notice:', error.message);
    return null;
  }
}

// Subscribe to real-time updates for a collection in Firestore
export function subscribeToFirebase(colName, onUpdate) {
  if (!isFirebaseConfigured()) return () => {};
  try {
    const colRef = collection(db, colName);
    return onSnapshot(colRef, (snapshot) => {
      const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      onUpdate(items);
    }, (error) => {
      console.warn(`[Firebase Realtime] ${colName} listener notice:`, error.message);
    });
  } catch (e) {
    return () => {};
  }
}
