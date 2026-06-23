"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { getPasswordChecks } from "@/services/passwordPolicy";

export function AuthPanel({ mode, redirectOnAuthenticated }: { mode: "login" | "signup"; redirectOnAuthenticated?: string }) {
  const auth = useAuth();
  const router = useRouter();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [rememberFor30Days, setRememberFor30Days] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  const passwordChecks = useMemo(() => getPasswordChecks(password), [password]);
  const resendRemainingSeconds = useCountdown(resendAvailableAt);
  const isResendCoolingDown = resendRemainingSeconds > 0;
  const isPasswordStrong = passwordChecks.every((rule) => rule.isValid);
  const isPasswordMatch = password.length > 0 && password === passwordConfirm;

  useEffect(() => {
    if (auth.user && redirectOnAuthenticated) {
      router.replace(redirectOnAuthenticated);
    }
  }, [auth.user, redirectOnAuthenticated, router]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFormMessage(null);

    if (mode === "signup") {
      if (!isPasswordStrong) {
        setFormError("Password must include at least 8 characters, lowercase, uppercase, number, and special character.");
        return;
      }

      if (!isPasswordMatch) {
        setFormError("Password confirmation does not match.");
        return;
      }

      const created = await auth.register(email, password, displayName, rememberFor30Days);
      if (created) {
        setFormMessage("Account created. Check your email and open the Firebase verification link before logging in.");
        setResendAvailableAt(Date.now() + 2 * 60 * 1000);
      }
      return;
    }

    await auth.login(email, password, rememberFor30Days);
  }

  async function handleGoogleLogin() {
    setFormError(null);
    setFormMessage(null);
    await auth.loginWithGoogle(rememberFor30Days);
  }

  async function handleResendVerificationEmail() {
    setFormError(null);
    setFormMessage(null);
    setIsResendingVerification(true);

    const sent = await auth.resendVerificationEmail();
    if (sent) {
      setFormMessage("Verification email sent again. Check your inbox.");
      setResendAvailableAt(Date.now() + 2 * 60 * 1000);
    }
    setIsResendingVerification(false);
  }

  if (redirectOnAuthenticated && (auth.isLoading || auth.user)) {
    return null;
  }

  if (auth.user) {
    const profileName = auth.user.displayName || auth.user.email || auth.user.uid;

    return (
      <section className="panel">
        <h2>Member</h2>
        <div className="member-summary">
          <div className="member-avatar" aria-label="Member profile image">
            {auth.user.photoURL ? <img alt="" src={auth.user.photoURL} /> : <span>{profileName.slice(0, 1).toUpperCase()}</span>}
          </div>
          <div>
            <p className="member-name">{profileName}</p>
            <p className="muted">Signed in</p>
          </div>
        </div>
        {!auth.user.emailVerified ? (
          <>
            <p className="muted">Email verification is still required.</p>
            <Button
              className="secondary"
              disabled={isResendingVerification || isResendCoolingDown || auth.isSubmitting}
              type="button"
              onClick={handleResendVerificationEmail}
            >
              {isResendingVerification
                ? "Sending..."
                : isResendCoolingDown
                  ? `Resend in ${formatCountdown(resendRemainingSeconds)}`
                  : "Resend verification email"}
            </Button>
          </>
        ) : null}
        {formMessage ? <p className="success">{formMessage}</p> : null}
        {auth.error ? <p className="error">{auth.error}</p> : null}
        <Link className="button secondary" href="/profile">
          Edit profile
        </Link>
        <Button type="button" onClick={() => auth.logout()}>
          Log out
        </Button>
      </section>
    );
  }

  return (
    <section className="panel">
      <h2>{mode === "signup" ? "Create account" : "Member login"}</h2>
      <Button className="google-button" type="button" onClick={handleGoogleLogin}>
        Continue with Google
      </Button>
      <div className="auth-divider">
        <span>or</span>
      </div>
      <form className="form-grid" onSubmit={handleSubmit}>
        {mode === "signup" ? (
          <label>
            Name
            <input value={displayName} onChange={(event) => setDisplayName(event.target.value)} required />
          </label>
        ) : null}
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        {mode === "signup" ? <p className="muted">Firebase will send an email verification link after account creation.</p> : null}
        <label>
          Password
          <span className="password-field">
            <input
              minLength={mode === "signup" ? 8 : 6}
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
        {mode === "signup" ? (
          <>
            <label>
              Confirm password
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
          </>
        ) : null}
        <label className="checkbox-row">
          <input
            checked={rememberFor30Days}
            type="checkbox"
            onChange={(event) => setRememberFor30Days(event.target.checked)}
          />
          Keep me signed in for 30 days
        </label>
        <Button disabled={auth.isSubmitting} type="submit">
          {auth.isSubmitting ? "Please wait..." : mode === "signup" ? "Sign up" : "Log in"}
        </Button>
        {mode === "login" ? (
          <Link className="text-button" href="/forgot-password">
            Forgot password?
          </Link>
        ) : null}
      </form>
      <div className="social-row secondary-social-row">
        <Button className="secondary" type="button" onClick={() => auth.loginWithFacebook()}>
          Facebook
        </Button>
        <Button className="secondary" type="button" onClick={() => auth.loginWithApple()}>
          Apple
        </Button>
      </div>
      <p className="muted">Phone authentication service boundary is prepared in authService.</p>
      {formError ? <p className="error">{formError}</p> : null}
      {formMessage ? <p className="success">{formMessage}</p> : null}
      {auth.error ? <p className="error">{auth.error}</p> : null}
    </section>
  );
}

function useCountdown(expiresAt: number | null) {
  const [remainingSeconds, setRemainingSeconds] = useState(0);

  useEffect(() => {
    if (!expiresAt) {
      setRemainingSeconds(0);
      return;
    }

    const expiryTime = expiresAt;

    function updateRemainingSeconds() {
      setRemainingSeconds(Math.max(0, Math.ceil((expiryTime - Date.now()) / 1000)));
    }

    updateRemainingSeconds();
    const intervalId = window.setInterval(updateRemainingSeconds, 1000);
    return () => window.clearInterval(intervalId);
  }, [expiresAt]);

  return remainingSeconds;
}

function formatCountdown(totalSeconds: number) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
