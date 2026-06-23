"use client";

import { useEffect } from "react";
import { Button } from "@/components/common/Button";

export default function AppError({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="page-shell">
      <section className="panel">
        <h2>Application error</h2>
        <p className="error">
          The app could not finish loading. Check Firebase environment variables and authorized domains.
        </p>
        <Button type="button" onClick={reset}>
          Try again
        </Button>
      </section>
    </main>
  );
}
