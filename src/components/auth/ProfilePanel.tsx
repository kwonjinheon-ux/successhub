"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { useProfileViewModel } from "@/viewmodels/ProfileViewModel";

export function ProfilePanel() {
  const auth = useAuth();
  const { profile, error, saveProfile } = useProfileViewModel(auth.user?.uid);
  const [displayName, setDisplayName] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await saveProfile({
      displayName,
      email: auth.user?.email,
      provider: "password"
    });
  }

  return (
    <section className="panel">
      <h2>Profile</h2>
      {auth.user ? (
        <form className="form-grid" onSubmit={handleSubmit}>
          <p className="muted">Current trust score: {profile?.trustScore ?? 0}</p>
          <label>
            Display name
            <input
              value={displayName}
              placeholder={profile?.displayName || auth.user.displayName || ""}
              onChange={(event) => setDisplayName(event.target.value)}
              required
            />
          </label>
          <Button type="submit">Save profile</Button>
        </form>
      ) : (
        <p className="muted">Login is required to edit profile data in Firebase Realtime Database.</p>
      )}
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
