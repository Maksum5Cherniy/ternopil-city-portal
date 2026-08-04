/*
 Server-side Firebase Admin initialization wrapper.
 Use this only in server-side code: route handlers, server actions, scripts or Cloud Functions.
 Do not expose service-account credentials to the client bundle.
*/

import {
  cert,
  getApps,
  initializeApp,
  type AppOptions,
  type ServiceAccount,
} from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

const projectId = process.env.FIREBASE_PROJECT_ID;
const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");

export const isFirebaseAdminConfigured = Boolean(projectId && clientEmail && privateKey);

const appOptions: AppOptions = {
  projectId,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
};

if (projectId && clientEmail && privateKey) {
  const serviceAccount: ServiceAccount = {
    projectId,
    clientEmail,
    privateKey,
  };

  appOptions.credential = cert(serviceAccount);
}

export const adminApp = getApps()[0] ?? initializeApp(appOptions);
export const adminAuth = getAuth(adminApp);
export const adminDb = getFirestore(adminApp);
export const adminStorage = getStorage(adminApp);
export default adminApp;
