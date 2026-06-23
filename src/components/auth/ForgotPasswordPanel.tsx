"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";

export function ForgotPasswordPanel() {
  const auth = useAuth();
  const [email, setEmail] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [formMessage, setFormMessage] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    setFormMessage(null);

    if (!email) {
      setFormError("Enter your account email.");
      return;
    }

    const sent = await auth.resetPassword(email);
    if (sent) {
      setFormMessage("Password reset link sent. Check your email.");
    }
  }

  return (
    <section className="panel">
      <h2>Reset password</h2>
      <form className="form-grid" onSubmit={handleSubmit}>
        <label>
          Email
          <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
        </label>
        <Button disabled={auth.isSubmitting} type="submit">
          {auth.isSubmitting ? "Sending..." : "Send reset link"}
        </Button>
        <Link className="text-button" href="/login">
          Back to login
        </Link>
      </form>
      {formError ? <p className="error">{formError}</p> : null}
      {formMessage ? <p className="success">{formMessage}</p> : null}
      {auth.error ? <p className="error">{auth.error}</p> : null}
    </section>
  );
}
