"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { useProfileViewModel } from "@/viewmodels/ProfileViewModel";

export function ProfilePanel() {
  const auth = useAuth();
  const { profile, isSaving, error, message, saveProfile } = useProfileViewModel(auth.user?.uid);
  const [displayName, setDisplayName] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    setDisplayName(profile?.displayName || auth.user?.displayName || "");
  }, [auth.user?.displayName, profile?.displayName]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!auth.user) {
      return;
    }

    await saveProfile({
      displayName,
      email: auth.user.email,
      emailVerified: auth.user.emailVerified,
      photoURL: auth.user.photoURL,
      provider: profile?.provider || (auth.user.providerData.some((provider) => provider.providerId === "google.com") ? "google" : "password")
    }, photoFile);
    setPhotoFile(null);
  }

  function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;
    setPhotoFile(file);

    if (!file) {
      setPhotoPreview(null);
      return;
    }

    setPhotoPreview(URL.createObjectURL(file));
  }

  const photoURL = photoPreview || profile?.photoURL || auth.user?.photoURL;

  return (
    <section className="panel">
      <h2>Profile</h2>
      {auth.user ? (
        <form className="form-grid" onSubmit={handleSubmit}>
          <div className="profile-editor">
            <div className="profile-photo" aria-label="Profile photo">
              {photoURL ? <img alt="" src={photoURL} /> : <span>{(displayName || auth.user.email || "U").slice(0, 1).toUpperCase()}</span>}
            </div>
            <label>
              Profile photo
              <input accept="image/*" type="file" onChange={handlePhotoChange} />
            </label>
          </div>
          <label>
            Name or nickname
            <input
              value={displayName}
              placeholder={profile?.displayName || auth.user.displayName || ""}
              onChange={(event) => setDisplayName(event.target.value)}
              required
            />
          </label>
          <Button disabled={isSaving} type="submit">{isSaving ? "Saving..." : "Save profile"}</Button>
        </form>
      ) : (
        <p className="muted">Login is required to edit profile data in Firebase Realtime Database.</p>
      )}
      {message ? <p className="success">{message}</p> : null}
      {error ? <p className="error">{error}</p> : null}
    </section>
  );
}
