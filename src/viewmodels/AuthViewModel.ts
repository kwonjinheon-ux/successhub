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

export function useAuthViewModel() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return observeAuthState((nextUser) => {
      setUser(nextUser);
      setIsLoading(false);
    });
  }, []);

  const actions = useMemo(
    () => ({
      async register(email: string, password: string, displayName: string) {
        setError(null);
        try {
          await registerWithEmail(email, password, displayName);
        } catch (nextError) {
          setError(nextError instanceof Error ? nextError.message : "Registration failed.");
        }
      },
      async login(email: string, password: string) {
        setError(null);
        try {
          await loginWithEmail(email, password);
        } catch (nextError) {
          setError(nextError instanceof Error ? nextError.message : "Login failed.");
        }
      },
      loginWithGoogle,
      loginWithFacebook,
      loginWithApple,
      logout
    }),
    []
  );

  return { user, isLoading, error, ...actions };
}
