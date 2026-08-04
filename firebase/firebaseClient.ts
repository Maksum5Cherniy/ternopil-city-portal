/*
 Client-side Firebase initialization. Do NOT include service-account secrets here.
 Use environment variables in .env.local and never commit private keys.
*/

import { getApps, initializeApp, type FirebaseApp, type FirebaseOptions } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const clientConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(
  clientConfig.apiKey &&
  clientConfig.authDomain &&
  clientConfig.projectId &&
  clientConfig.storageBucket &&
  clientConfig.messagingSenderId &&
  clientConfig.appId,
);

const firebaseApp: FirebaseApp | undefined = isFirebaseConfigured
  ? (getApps()[0] ?? initializeApp(clientConfig))
  : undefined;

export const firebaseAuth = firebaseApp ? getAuth(firebaseApp) : null;
export const firebaseDb = firebaseApp ? getFirestore(firebaseApp) : null;
export const firebaseStorage = firebaseApp ? getStorage(firebaseApp) : null;
