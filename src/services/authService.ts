"use client";

import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";
import { getFirebaseAuth } from "@/services/firebaseClient";
import { upsertUserProfile } from "@/services/databaseService";

export function observeAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), callback);
}

export async function registerWithEmail(email: string, password: string, displayName: string) {
  const credential = await createUserWithEmailAndPassword(getFirebaseAuth(), email, password);
  await updateProfile(credential.user, { displayName });
  await upsertUserProfile(credential.user.uid, {
    uid: credential.user.uid,
    email,
    displayName,
    provider: "password"
  });
  return credential.user;
}

export async function loginWithEmail(email: string, password: string) {
  return signInWithEmailAndPassword(getFirebaseAuth(), email, password);
}

export async function loginWithGoogle() {
  return signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
}

export async function loginWithFacebook() {
  return signInWithPopup(getFirebaseAuth(), new FacebookAuthProvider());
}

export async function loginWithApple() {
  return signInWithPopup(getFirebaseAuth(), new OAuthProvider("apple.com"));
}

export async function startPhoneLogin(phoneNumber: string, verifier: RecaptchaVerifier) {
  return signInWithPhoneNumber(getFirebaseAuth(), phoneNumber, verifier);
}

export async function logout() {
  return signOut(getFirebaseAuth());
}
