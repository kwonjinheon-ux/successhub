"use client";

import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";

const passwordRules = [
  { label: "At least 8 characters", test: (value: string) => value.length >= 8 },
  { label: "Lowercase letter", test: (value: string) => /[a-z]/.test(value) },
  { label: "Uppercase letter", test: (value: string) => /[A-Z]/.test(value) },
  { label: "Number", test: (value: string) => /\d/.test(value) },
  { label: "Special character", test: (value: string) => /[^A-Za-z0-9]/.test(value) }
];

export function AuthPanel({ mode }: { mode: "login" | "signup" }) {
  const auth = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isResendingVerification, setIsResendingVerification] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const passwordChecks = useMemo(() => passwordRules.map((rule) => ({ ...rule, isValid: rule.test(password) })), [password]);
  const isPasswordStrong = passwordChecks.every((rule) => rule.isValid);
  const isPasswordMatch = password.length > 0 && password === passwordConfirm;

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

      const created = await auth.register(email, password, displayName);
      if (created) {
        setFormMessage("Account created. Check your email and open the Firebase verification link before logging in.");
      }
      return;
    }

    await auth.login(email, password);
  }

  async function handleResendVerificationEmail() {
    setFormError(null);
    setFormMessage(null);
    setIsResendingVerification(true);

    const sent = await auth.resendVerificationEmail();
    if (sent) {
      setFormMessage("Verification email sent again. Check your inbox.");
    }
    setIsResendingVerification(false);
  }

  return (
    <section className="panel">
      <h2>{mode === "signup" ? "Create account" : "Member login"}</h2>
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
          <input
            minLength={mode === "signup" ? 8 : 6}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
        {mode === "signup" ? (
          <>
            <label>
              Confirm password
              <input
                minLength={8}
                type="password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                required
              />
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
        <Button type="submit">{mode === "signup" ? "Sign up" : "Log in"}</Button>
      </form>
      <div className="social-row">
        <Button className="secondary" type="button" onClick={() => auth.loginWithGoogle()}>
          Google
        </Button>
        <Button className="secondary" type="button" onClick={() => auth.loginWithFacebook()}>
          Facebook
        </Button>
        <Button className="secondary" type="button" onClick={() => auth.loginWithApple()}>
          Apple
        </Button>
      </div>
      <p className="muted">Phone authentication service boundary is prepared in authService.</p>
      {auth.user && !auth.user.emailVerified ? (
        <Button className="secondary" disabled={isResendingVerification} type="button" onClick={handleResendVerificationEmail}>
          {isResendingVerification ? "Sending..." : "Resend verification email"}
        </Button>
      ) : null}
      {formError ? <p className="error">{formError}</p> : null}
      {formMessage ? <p className="success">{formMessage}</p> : null}
      {auth.error ? <p className="error">{auth.error}</p> : null}
      {auth.user ? (
        <p className="success">
          Signed in as {auth.user.displayName || auth.user.email || auth.user.uid}
          {!auth.user.emailVerified ? " (email not verified)" : ""}
          <Button className="link-button" type="button" onClick={() => auth.logout()}>
            Log out
          </Button>
        </p>
      ) : null}
    </section>
  );
}
