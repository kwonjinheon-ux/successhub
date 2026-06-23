"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { handleEmailActionCode } from "@/services/authService";
import { getFirebaseErrorMessage } from "@/services/firebaseClient";

export function AuthActionPanel() {
  const searchParams = useSearchParams();
  const auth = useAuth();
  const { refreshUser } = auth;
  const [status, setStatus] = useState<"checking" | "success" | "error">("checking");
  const [message, setMessage] = useState("Confirming your email address...");

  useEffect(() => {
    let isMounted = true;

    async function confirmEmail() {
      const mode = searchParams.get("mode");
      const oobCode = searchParams.get("oobCode");

      try {
        if (mode === "verifyEmail" && oobCode) {
          await handleEmailActionCode(oobCode);
        }

        const refreshedUser = await refreshUser();

        if (!isMounted) {
          return;
        }

        if (refreshedUser?.emailVerified) {
          setStatus("success");
          setMessage("Email verified. You are signed in.");
          return;
        }

        setStatus("success");
        setMessage("Email verified. Please log in with your email and password.");
      } catch (error) {
        console.error(error);
        if (!isMounted) {
          return;
        }

        setStatus("error");
        setMessage(getFirebaseErrorMessage(error));
      }
    }

    confirmEmail();
    return () => {
      isMounted = false;
    };
  }, [refreshUser, searchParams]);

  return (
    <main className="page-shell">
      <section className="panel">
        <h2>Email verification</h2>
        <p className={status === "error" ? "error" : status === "success" ? "success" : "muted"}>{message}</p>
        {auth.user ? (
          <p className="success">
            Signed in as {auth.user.displayName || auth.user.email || auth.user.uid}
            <Button className="link-button" type="button" onClick={() => auth.logout()}>
              Log out
            </Button>
          </p>
        ) : (
          <Link className="button" href="/login">
            Go to login
          </Link>
        )}
      </section>
    </main>
  );
}
