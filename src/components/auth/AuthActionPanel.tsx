"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { getPasswordResetEmail, handleEmailActionCode, resetPasswordWithCode } from "@/services/authService";
import { getFirebaseErrorMessage } from "@/services/firebaseClient";
import { getPasswordChecks } from "@/services/passwordPolicy";

export function AuthActionPanel() {
  const searchParams = useSearchParams();
  const auth = useAuth();
  const { refreshUser } = auth;
  const mode = searchParams.get("mode");
  const oobCode = searchParams.get("oobCode");
  const isPasswordReset = mode === "resetPassword" && Boolean(oobCode);
  const [status, setStatus] = useState<"checking" | "ready" | "success" | "error">(isPasswordReset ? "checking" : "checking");
  const [message, setMessage] = useState("Confirming your email address...");
  const [resetEmail, setResetEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const passwordChecks = useMemo(() => getPasswordChecks(password), [password]);
  const isPasswordStrong = passwordChecks.every((rule) => rule.isValid);
  const isPasswordMatch = password.length > 0 && password === passwordConfirm;

  useEffect(() => {
    let isMounted = true;

    async function handleActionCode() {
      try {
        if (mode === "resetPassword" && oobCode) {
          const email = await getPasswordResetEmail(oobCode);

          if (!isMounted) {
            return;
          }

          setResetEmail(email);
          setStatus("ready");
          setMessage("Choose a new password.");
          return;
        }

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

    handleActionCode();
    return () => {
      isMounted = false;
    };
  }, [mode, oobCode, refreshUser]);

  async function handlePasswordResetSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");

    if (!oobCode) {
      setStatus("error");
      setMessage("This password reset link is missing a Firebase action code.");
      return;
    }

    if (!isPasswordStrong) {
      setStatus("ready");
      setMessage("Password must include at least 8 characters, lowercase, uppercase, number, and special character.");
      return;
    }

    if (!isPasswordMatch) {
      setStatus("ready");
      setMessage("Password confirmation does not match.");
      return;
    }

    try {
      setIsSubmitting(true);
      await resetPasswordWithCode(oobCode, password);
      setStatus("success");
      setMessage("Password updated. You can log in with your new password.");
      setPassword("");
      setPasswordConfirm("");
    } catch (error) {
      console.error(error);
      setStatus("error");
      setMessage(getFirebaseErrorMessage(error));
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isPasswordReset && status === "ready") {
    return (
      <main className="page-shell">
        <section className="panel">
          <h2>Reset password</h2>
          {resetEmail ? <p className="muted">Account: {resetEmail}</p> : null}
          <form className="form-grid" onSubmit={handlePasswordResetSubmit}>
            <label>
              New password
              <span className="password-field">
                <input
                  minLength={8}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword((current) => !current)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </span>
            </label>
            <label>
              Confirm new password
              <span className="password-field">
                <input
                  minLength={8}
                  type={showPasswordConfirm ? "text" : "password"}
                  value={passwordConfirm}
                  onChange={(event) => setPasswordConfirm(event.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPasswordConfirm((current) => !current)}>
                  {showPasswordConfirm ? "Hide" : "Show"}
                </button>
              </span>
            </label>
            <div className="password-feedback">
              {passwordChecks.map((rule) => (
                <span className={rule.isValid ? "valid" : "invalid"} key={rule.label}>
                  {rule.label}
                </span>
              ))}
              {passwordConfirm ? (
                <span className={isPasswordMatch ? "valid" : "invalid"}>
                  {isPasswordMatch ? "Passwords match" : "Passwords do not match"}
                </span>
              ) : null}
            </div>
            <Button disabled={isSubmitting} type="submit">
              {isSubmitting ? "Updating..." : "Update password"}
            </Button>
          </form>
          {message ? <p className="muted">{message}</p> : null}
        </section>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <section className="panel">
        <h2>{isPasswordReset ? "Reset password" : "Email verification"}</h2>
        <p className={status === "error" ? "error" : status === "success" ? "success" : "muted"}>{message}</p>
        {isPasswordReset && status === "success" ? (
          <Link className="button" href="/login">
            Go to login
          </Link>
        ) : null}
        {auth.user ? (
          <p className="success">
            Signed in as {auth.user.displayName || auth.user.email || auth.user.uid}
            <Button className="link-button" type="button" onClick={() => auth.logout()}>
              Log out
            </Button>
          </p>
        ) : (
          !isPasswordReset ? (
            <Link className="button" href="/login">
              Go to login
            </Link>
          ) : null
        )}
      </section>
    </main>
  );
}
