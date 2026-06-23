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
  registerWithEmail
} from "@/services/authService";
import { getFirebaseConfigStatus, getFirebaseErrorMessage } from "@/services/firebaseClient";

export function useAuthViewModel() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(() => getFirebaseConfigStatus().isReady);
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
        try {
          await registerWithEmail(email, password, displayName);
        } catch (nextError) {
          console.error(nextError);
          setError(getFirebaseErrorMessage(nextError));
        }
      },
      async login(email: string, password: string) {
        setError(null);
        try {
          await loginWithEmail(email, password);
        } catch (nextError) {
          console.error(nextError);
          setError(getFirebaseErrorMessage(nextError));
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
      }
    }),
    []
  );

  return { user, isLoading, error, ...actions };
}
