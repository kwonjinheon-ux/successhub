"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
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
  const [emailCode, setEmailCode] = useState("");
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [emailCodeExpiresAt, setEmailCodeExpiresAt] = useState<number | null>(null);
  const [emailMessage, setEmailMessage] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const remainingSeconds = useCountdown(emailCodeExpiresAt);
  const passwordChecks = useMemo(() => passwordRules.map((rule) => ({ ...rule, isValid: rule.test(password) })), [password]);
  const isPasswordStrong = passwordChecks.every((rule) => rule.isValid);
  const isPasswordMatch = password.length > 0 && password === passwordConfirm;

  useEffect(() => {
    setIsEmailVerified(false);
    setEmailCode("");
    setEmailCodeExpiresAt(null);
    setEmailMessage(null);
  }, [email]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);

    if (mode === "signup") {
      if (!isEmailVerified) {
        setFormError("Verify your email with the 2 minute code before creating an account.");
        return;
      }

      if (!isPasswordStrong) {
        setFormError("Password must include at least 8 characters, lowercase, uppercase, number, and special character.");
        return;
      }

      if (!isPasswordMatch) {
        setFormError("Password confirmation does not match.");
        return;
      }

      await auth.register(email, password, displayName);
      return;
    }

    await auth.login(email, password);
  }

  async function handleSendEmailCode() {
    setFormError(null);
    setEmailMessage(null);
    setIsSendingCode(true);

    try {
      const response = await fetch("/api/auth/email-code", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      const result = (await response.json()) as {
        message?: string;
        expiresInSeconds?: number;
        developmentCode?: string;
      };

      if (!response.ok) {
        throw new Error(result.message || "Could not send verification code.");
      }

      setEmailCodeExpiresAt(Date.now() + (result.expiresInSeconds || 120) * 1000);
      setEmailMessage(result.developmentCode ? `Development code: ${result.developmentCode}` : result.message || "Code sent.");
    } catch (error) {
      setEmailMessage(error instanceof Error ? error.message : "Could not send verification code.");
    } finally {
      setIsSendingCode(false);
    }
  }

  async function handleVerifyEmailCode() {
    setFormError(null);
    setEmailMessage(null);
    setIsVerifyingCode(true);

    try {
      const response = await fetch("/api/auth/email-code/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code: emailCode })
      });
      const result = (await response.json()) as { message?: string; verified?: boolean };

      if (!response.ok || !result.verified) {
        throw new Error(result.message || "Verification code does not match.");
      }

      setIsEmailVerified(true);
      setEmailCodeExpiresAt(null);
      setEmailMessage(result.message || "Email verified.");
    } catch (error) {
      setEmailMessage(error instanceof Error ? error.message : "Could not verify code.");
    } finally {
      setIsVerifyingCode(false);
    }
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
        {mode === "signup" ? (
          <div className="verification-grid">
            <Button className="secondary" disabled={!email || isSendingCode || isEmailVerified} type="button" onClick={handleSendEmailCode}>
              {isSendingCode ? "Sending..." : "Send code"}
            </Button>
            <label>
              Email code
              <input
                inputMode="numeric"
                maxLength={6}
                pattern="[0-9]{6}"
                value={emailCode}
                onChange={(event) => setEmailCode(event.target.value.replace(/\D/g, "").slice(0, 6))}
                required
              />
            </label>
            <Button
              className="secondary"
              disabled={emailCode.length !== 6 || isVerifyingCode || isEmailVerified || remainingSeconds === 0}
              type="button"
              onClick={handleVerifyEmailCode}
            >
              {isVerifyingCode ? "Checking..." : "Verify code"}
            </Button>
            {emailCodeExpiresAt && !isEmailVerified ? <p className="muted">Code expires in {remainingSeconds}s.</p> : null}
            {isEmailVerified ? <p className="success">Email verified.</p> : null}
            {emailMessage ? <p className={isEmailVerified ? "success" : "muted"}>{emailMessage}</p> : null}
          </div>
        ) : null}
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
      {formError ? <p className="error">{formError}</p> : null}
      {auth.error ? <p className="error">{auth.error}</p> : null}
      {auth.user ? (
        <p className="success">
          Signed in as {auth.user.displayName || auth.user.email || auth.user.uid}
          <Button className="link-button" type="button" onClick={() => auth.logout()}>
            Log out
          </Button>
        </p>
      ) : null}
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
