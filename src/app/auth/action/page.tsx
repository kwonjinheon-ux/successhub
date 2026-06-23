import { Suspense } from "react";
import { AuthActionPanel } from "@/components/auth/AuthActionPanel";

export default function AuthActionPage() {
  return (
    <Suspense
      fallback={
        <main className="page-shell">
          <section className="panel">
            <h2>Email verification</h2>
            <p className="muted">Confirming your email address...</p>
          </section>
        </main>
      }
    >
      <AuthActionPanel />
    </Suspense>
  );
}
