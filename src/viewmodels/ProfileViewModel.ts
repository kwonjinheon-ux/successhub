"use client";

import { useEffect, useState } from "react";
import type { UserModel } from "@/models/UserModel";
import { sendCurrentUserPasswordReset, updateCurrentUserEmail, updateCurrentUserProfile } from "@/services/authService";
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

  async function saveEmail(email: string) {
    if (!uid) {
      throw new Error("Login is required to update email.");
    }

    try {
      setIsSaving(true);
      setError(null);
      setMessage(null);

      const updatedUser = await updateCurrentUserEmail(email);
      await upsertUserProfile(uid, {
        email,
        emailVerified: updatedUser?.emailVerified ?? false
      });
      setProfile((current) => ({ ...current, uid, email, emailVerified: updatedUser?.emailVerified ?? false } as UserModel));
      setMessage("Email address updated.");
      return true;
    } catch (nextError) {
      console.error(nextError);
      setError(getFirebaseErrorMessage(nextError));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  async function resetPassword() {
    try {
      setIsSaving(true);
      setError(null);
      setMessage(null);

      await sendCurrentUserPasswordReset();
      setMessage("Password reset email sent.");
      return true;
    } catch (nextError) {
      console.error(nextError);
      setError(getFirebaseErrorMessage(nextError));
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  return { profile, isSaving, error, message, saveProfile, saveEmail, resetPassword };
}
