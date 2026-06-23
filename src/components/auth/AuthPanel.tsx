"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";

export function AuthPanel({ mode }: { mode: "login" | "signup" }) {
  const auth = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (mode === "signup") {
      await auth.register(email, password, displayName);
      return;
    }

    await auth.login(email, password);
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
        <label>
          Password
          <input
            minLength={6}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </label>
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
