"use client";

import { useEffect, useMemo, useState } from "react";
import type { User } from "firebase/auth";
import {
  loginWithApple,
  loginWithEmail,
  loginWithFacebook,
  loginWithGoogle,
  logout,
  observeAuthState,
  resendVerificationEmail,
  registerWithEmail
} from "@/services/authService";
import { getFirebaseConfigStatus, getFirebaseErrorMessage } from "@/services/firebaseClient";

export function useAuthViewModel() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => getFirebaseConfigStatus().isReady);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      return observeAuthState((nextUser) => {
        setUser(nextUser);
        setIsLoading(false);
      });
    } catch (nextError) {
      console.error(nextError);
      setError(getFirebaseErrorMessage(nextError));
      setIsLoading(false);
    }
  }, []);

  const actions = useMemo(
    () => ({
      async register(email: string, password: string, displayName: string) {
        setError(null);
        setIsSubmitting(true);
        try {
          await registerWithEmail(email, password, displayName);
          return true;
        } catch (nextError) {
          console.error(nextError);
          setError(getFirebaseErrorMessage(nextError));
          return false;
        } finally {
          setIsSubmitting(false);
        }
      },
      async login(email: string, password: string) {
        setError(null);
        setIsSubmitting(true);
        try {
          await loginWithEmail(email, password);
        } catch (nextError) {
          console.error(nextError);
          setError(getFirebaseErrorMessage(nextError));
        } finally {
          setIsSubmitting(false);
        }
      },
      async loginWithGoogle() {
        setError(null);
        try {
          await loginWithGoogle();
        } catch (nextError) {
          console.error(nextError);
          setError(getFirebaseErrorMessage(nextError));
        }
      },
      async loginWithFacebook() {
        setError(null);
        try {
          await loginWithFacebook();
        } catch (nextError) {
          console.error(nextError);
          setError(getFirebaseErrorMessage(nextError));
        }
      },
      async loginWithApple() {
        setError(null);
        try {
          await loginWithApple();
        } catch (nextError) {
          console.error(nextError);
          setError(getFirebaseErrorMessage(nextError));
        }
      },
      async logout() {
        setError(null);
        try {
          await logout();
        } catch (nextError) {
          console.error(nextError);
          setError(getFirebaseErrorMessage(nextError));
        }
      },
      async resendVerificationEmail() {
        setError(null);
        setIsSubmitting(true);
        try {
          await resendVerificationEmail();
          return true;
        } catch (nextError) {
          console.error(nextError);
          setError(getFirebaseErrorMessage(nextError));
          return false;
        } finally {
          setIsSubmitting(false);
        }
      }
    }),
    []
  );

  return { user, isLoading, isSubmitting, error, ...actions };
}
