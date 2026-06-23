import { Suspense } from "react";
import { AuthActionPanel } from "@/components/auth/AuthActionPanel";

export default function FirebaseStyleAuthActionPage() {
  return (
    <Suspense
      fallback={
        <main className="page-shell">
          <section className="panel">
            <h2>Firebase action</h2>
            <p className="muted">Checking your Firebase link...</p>
          </section>
        </main>
      }
    >
      <AuthActionPanel />
    </Suspense>
  );
}
