"use client";

import { FirebaseApp, getApp, getApps, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import { Database, getDatabase } from "firebase/database";
import { Firestore, getFirestore } from "firebase/firestore";
import { FirebaseStorage, getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const requiredClientEnv = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID"
] as const;

type FirebaseClientEnvName = (typeof requiredClientEnv)[number];

const envValueByName: Record<FirebaseClientEnvName, string | undefined> = {
  NEXT_PUBLIC_FIREBASE_API_KEY: firebaseConfig.apiKey,
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: firebaseConfig.authDomain,
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: firebaseConfig.projectId,
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: firebaseConfig.storageBucket,
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: firebaseConfig.messagingSenderId,
  NEXT_PUBLIC_FIREBASE_APP_ID: firebaseConfig.appId
};

export class FirebaseConfigError extends Error {
  readonly missingKeys: FirebaseClientEnvName[];

  constructor(missingKeys: FirebaseClientEnvName[]) {
    super(`Firebase configuration is missing: ${missingKeys.join(", ")}`);
    this.name = "FirebaseConfigError";
    this.missingKeys = missingKeys;
  }
}

export function getFirebaseConfigStatus() {
  const missingKeys = requiredClientEnv.filter((key) => !envValueByName[key]);
  return {
    isReady: missingKeys.length === 0,
    missingKeys
  };
}

export function getFirebaseErrorMessage(error: unknown) {
  if (error instanceof FirebaseConfigError) {
    return `Firebase environment variables are missing: ${error.missingKeys.join(", ")}.`;
  }

  if (error instanceof Error) {
    if (error.message.includes("auth/unauthorized-domain")) {
      return "This domain is not authorized in Firebase Authentication. Add the App Hosting domain in Firebase Authentication settings.";
    }

    if (error.message.includes("auth/unauthorized-continue-uri")) {
      return "Firebase blocked the email verification link URL. Use the default Firebase email action URL or add the domain to authorized domains.";
    }

    if (error.message.includes("auth/invalid-continue-uri")) {
      return "Firebase could not create the email verification link because the continue URL is invalid.";
    }

    if (error.message.includes("auth/invalid-api-key")) {
      return "The Firebase API key is invalid or missing. Check NEXT_PUBLIC_FIREBASE_API_KEY in App Hosting.";
    }

    if (error.message.includes("auth/too-many-requests")) {
      return "Firebase temporarily blocked this action because too many requests were sent. Please wait a few minutes before trying again.";
    }

    if (error.message.includes("auth/email-already-in-use")) {
      return "This email is already registered. Log in, then use resend verification email if needed.";
    }

    if (error.message.includes("auth/expired-action-code")) {
      return "This verification link has expired. Request a new verification email.";
    }

    if (error.message.includes("auth/invalid-action-code")) {
      return "This verification link is invalid or was already used.";
    }

    return error.message;
  }

  return "Firebase is temporarily unavailable.";
}

function assertFirebaseConfig() {
  const status = getFirebaseConfigStatus();
  if (!status.isReady) {
    throw new FirebaseConfigError(status.missingKeys);
  }
}

export function getFirebaseApp(): FirebaseApp {
  assertFirebaseConfig();
  return getApps().length ? getApp() : initializeApp(firebaseConfig);
}

export function getFirebaseAuth(): Auth {
  return getAuth(getFirebaseApp());
}

export function getRealtimeDb(): Database {
  return getDatabase(getFirebaseApp());
}

export function getFirestoreDb(): Firestore {
  return getFirestore(getFirebaseApp());
}

export function getFirebaseStorage(): FirebaseStorage {
  return getStorage(getFirebaseApp());
}
