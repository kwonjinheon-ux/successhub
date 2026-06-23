"use client";

import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  User,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
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
  await sendVerificationEmail(credential.user);
  await upsertUserProfile(credential.user.uid, {
    uid: credential.user.uid,
    email,
    displayName,
    emailVerified: credential.user.emailVerified,
    provider: "password"
  });
  return credential.user;
}

export async function loginWithEmail(email: string, password: string) {
  const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);

  if (!credential.user.emailVerified) {
    await sendVerificationEmail(credential.user);
    await signOut(getFirebaseAuth());
    throw new Error("Please verify your email address first. We sent a new verification email.");
  }

  return credential;
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

export async function resendVerificationEmail() {
  const currentUser = getFirebaseAuth().currentUser;

  if (!currentUser) {
    throw new Error("Login or create an account before requesting a verification email.");
  }

  if (currentUser.emailVerified) {
    throw new Error("This email address is already verified.");
  }

  await sendVerificationEmail(currentUser);
}

async function sendVerificationEmail(user: User) {
  const origin = typeof window !== "undefined" ? window.location.origin : undefined;

  await sendEmailVerification(user, {
    url: origin ? `${origin}/login` : "https://successhub--success-hub-2026.asia-southeast1.hosted.app/login",
    handleCodeInApp: false
  });
}
