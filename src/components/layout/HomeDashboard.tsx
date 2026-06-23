"use client";

import Link from "next/link";
import { AuthPanel } from "@/components/auth/AuthPanel";
import { MainNav } from "@/components/layout/MainNav";
import { CommunityPanel } from "@/components/community/CommunityPanel";
import { MarketPanel } from "@/components/market/MarketPanel";
import { useAuth } from "@/hooks/useAuth";

export function HomeDashboard() {
  const auth = useAuth();

  return (
    <main className="page-shell">
      <MainNav />
      <section className="hero-band">
        <div>
          <p className="eyebrow">Firebase first community platform</p>
          <h1>Success Hub 2026</h1>
          <p>
            Authentication, Realtime Database, Storage, and App Hosting are wired as the
            default architecture for web now and mobile expansion later.
          </p>
        </div>
        <div className="hero-actions">
          {!auth.user ? (
            <Link className="button" href="/signup">
              Join
            </Link>
          ) : null}
          <Link className="button secondary" href="/market">
            Browse Market
          </Link>
        </div>
      </section>
      <section className="two-column">
        <AuthPanel mode="login" />
        <div className="stack">
          <CommunityPanel compact />
          <MarketPanel compact />
        </div>
      </section>
    </main>
  );
}
