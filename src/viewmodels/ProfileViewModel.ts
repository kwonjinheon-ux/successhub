"use client";

import { useEffect, useState } from "react";
import type { UserModel } from "@/models/UserModel";
import { updateCurrentUserProfile } from "@/services/authService";
import { readUserProfile, upsertUserProfile } from "@/services/databaseService";
import { getFirebaseErrorMessage } from "@/services/firebaseClient";
import { uploadProfileImage } from "@/services/storageService";

export function useProfileViewModel(uid?: string) {
  const [profile, setProfile] = useState<UserModel | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      return;
    }

    readUserProfile(uid).then(setProfile).catch((nextError) => {
      console.error(nextError);
      setError(getFirebaseErrorMessage(nextError));
    });
  }, [uid]);

  async function saveProfile(nextProfile: Partial<UserModel>, photoFile?: File | null) {
    if (!uid) {
      throw new Error("Login is required to update profile.");
    }

    try {
      setIsSaving(true);
      setError(null);
      setMessage(null);

      const photoURL = photoFile ? await uploadProfileImage(uid, photoFile) : nextProfile.photoURL;
      const savedProfile = { ...nextProfile, photoURL };

      await updateCurrentUserProfile({
        displayName: savedProfile.displayName,
        photoURL: savedProfile.photoURL
      });
      await upsertUserProfile(uid, savedProfile);
      setProfile((current) => ({ ...current, ...savedProfile, uid } as UserModel));
      setMessage("Profile updated.");
      return true;
    } catch (nextError) {
      console.error(nextError);
      setError(getFirebaseErrorMessage(nextError));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  return { profile, isSaving, error, message, saveProfile };
}
