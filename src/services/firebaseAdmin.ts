import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getDatabase } from "firebase-admin/database";

const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
const hasServiceAccount = process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && privateKey;

export function getFirebaseAdminApp() {
  if (getApps().length) {
    return getApps()[0];
  }

  return initializeApp({
      credential: hasServiceAccount
        ? cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey
          })
        : applicationDefault(),
      databaseURL: process.env.FIREBASE_DATABASE_URL || process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL
    });
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminDatabase() {
  const databaseUrl = process.env.FIREBASE_DATABASE_URL || process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL;

  if (!databaseUrl) {
    throw new Error("Firebase Database URL is missing. Set FIREBASE_DATABASE_URL or NEXT_PUBLIC_FIREBASE_DATABASE_URL.");
  }

  return getDatabase(getFirebaseAdminApp());
}
