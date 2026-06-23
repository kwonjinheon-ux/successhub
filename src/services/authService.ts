"use client";

import {
  FacebookAuthProvider,
  GoogleAuthProvider,
  OAuthProvider,
  RecaptchaVerifier,
  User,
  applyActionCode,
  browserLocalPersistence,
  browserSessionPersistence,
  checkActionCode,
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendEmailVerification,
  sendPasswordResetEmail,
  setPersistence,
  signInWithEmailAndPassword,
  signInWithPhoneNumber,
  signInWithPopup,
  signOut,
  updateEmail,
  updateProfile,
  verifyPasswordResetCode
} from "firebase/auth";
import { getFirebaseAuth } from "@/services/firebaseClient";
import { upsertUserProfile } from "@/services/databaseService";

const AUTH_EXPIRES_AT_KEY = "successHubAuthExpiresAt";
const THIRTY_DAYS_MS = 30 * 24 * 60 * 60 * 1000;

export function observeAuthState(callback: (user: User | null) => void) {
  return onAuthStateChanged(getFirebaseAuth(), async (user) => {
    if (user && isPersistedSessionExpired()) {
      clearRememberExpiry();
      await signOut(getFirebaseAuth());
      callback(null);
      return;
    }

    callback(user);
  });
}

export async function registerWithEmail(email: string, password: string, displayName: string, rememberFor30Days = false) {
  await setAuthPersistence(rememberFor30Days);
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

export async function loginWithEmail(email: string, password: string, rememberFor30Days = false) {
  await setAuthPersistence(rememberFor30Days);
  const credential = await signInWithEmailAndPassword(getFirebaseAuth(), email, password);

  if (!credential.user.emailVerified) {
    await signOut(getFirebaseAuth());
    throw new Error("Please verify your email address first. Check the Firebase verification email sent when the account was created.");
  }

  return credential;
}

export async function loginWithGoogle(rememberFor30Days = false) {
  await setAuthPersistence(rememberFor30Days);
  const credential = await signInWithPopup(getFirebaseAuth(), new GoogleAuthProvider());
  await upsertUserProfile(credential.user.uid, {
    uid: credential.user.uid,
    email: credential.user.email,
    displayName: credential.user.displayName,
    photoURL: credential.user.photoURL,
    emailVerified: credential.user.emailVerified,
    provider: "google"
  });
  return credential;
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
  clearRememberExpiry();
  return signOut(getFirebaseAuth());
}

export async function updateCurrentUserProfile(profile: { displayName?: string | null; photoURL?: string | null }) {
  const currentUser = getFirebaseAuth().currentUser;

  if (!currentUser) {
    throw new Error("Login is required to update profile.");
  }

  await updateProfile(currentUser, profile);
  await currentUser.reload();
  return getFirebaseAuth().currentUser;
}

export async function updateCurrentUserEmail(email: string) {
  const currentUser = getFirebaseAuth().currentUser;

  if (!currentUser) {
    throw new Error("Login is required to update email.");
  }

  await updateEmail(currentUser, email);
  await currentUser.reload();
  await upsertUserProfile(currentUser.uid, {
    uid: currentUser.uid,
    email,
    emailVerified: currentUser.emailVerified,
    displayName: currentUser.displayName,
    photoURL: currentUser.photoURL
  });
  return getFirebaseAuth().currentUser;
}

export async function sendPasswordReset(email: string) {
  const origin = getEmailActionOrigin();

  await sendPasswordResetEmail(getFirebaseAuth(), email, {
    url: `${origin}/login`,
    handleCodeInApp: false
  });
}

export async function sendCurrentUserPasswordReset() {
  const currentUser = getFirebaseAuth().currentUser;

  if (!currentUser?.email) {
    throw new Error("This account does not have an email address for password reset.");
  }

  await sendPasswordReset(currentUser.email);
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

export async function handleEmailActionCode(oobCode: string) {
  const auth = getFirebaseAuth();
  await checkActionCode(auth, oobCode);
  await applyActionCode(auth, oobCode);

  if (auth.currentUser) {
    await auth.currentUser.reload();
    await upsertUserProfile(auth.currentUser.uid, {
      uid: auth.currentUser.uid,
      email: auth.currentUser.email,
      displayName: auth.currentUser.displayName,
      emailVerified: auth.currentUser.emailVerified,
      provider: "password"
    });
  }

  return auth.currentUser;
}

export function getPasswordResetEmail(oobCode: string) {
  return verifyPasswordResetCode(getFirebaseAuth(), oobCode);
}

export function resetPasswordWithCode(oobCode: string, newPassword: string) {
  return confirmPasswordReset(getFirebaseAuth(), oobCode, newPassword);
}

export async function refreshCurrentUser() {
  const currentUser = getFirebaseAuth().currentUser;

  if (!currentUser) {
    return null;
  }

  await currentUser.reload();
  return getFirebaseAuth().currentUser;
}

async function sendVerificationEmail(user: User) {
  const origin = getEmailActionOrigin();

  await sendEmailVerification(user, {
    url: `${origin}/auth/action`,
    handleCodeInApp: true
  });
}

function getEmailActionOrigin() {
  return typeof window !== "undefined" ? window.location.origin : "https://successhub--success-hub-2026.asia-southeast1.hosted.app";
}

function setAuthPersistence(rememberFor30Days: boolean) {
  setRememberExpiry(rememberFor30Days);
  return setPersistence(getFirebaseAuth(), rememberFor30Days ? browserLocalPersistence : browserSessionPersistence);
}

function setRememberExpiry(rememberFor30Days: boolean) {
  if (typeof window === "undefined") {
    return;
  }

  if (rememberFor30Days) {
    window.localStorage.setItem(AUTH_EXPIRES_AT_KEY, String(Date.now() + THIRTY_DAYS_MS));
    return;
  }

  clearRememberExpiry();
}

function isPersistedSessionExpired() {
  if (typeof window === "undefined") {
    return false;
  }

  const expiresAt = Number(window.localStorage.getItem(AUTH_EXPIRES_AT_KEY));
  return Boolean(expiresAt && Date.now() > expiresAt);
}

function clearRememberExpiry() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_EXPIRES_AT_KEY);
}
