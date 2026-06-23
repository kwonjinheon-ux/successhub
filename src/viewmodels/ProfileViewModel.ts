"use client";

import { useEffect, useState } from "react";
import type { UserModel } from "@/models/UserModel";
import { readUserProfile, upsertUserProfile } from "@/services/databaseService";
import { getFirebaseErrorMessage } from "@/services/firebaseClient";

export function useProfileViewModel(uid?: string) {
  const [profile, setProfile] = useState<UserModel | null>(null);
  const [error, setError] = useState<string | null>(null);

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

  async function saveProfile(nextProfile: Partial<UserModel>) {
    if (!uid) {
      throw new Error("Login is required to update profile.");
    }

    try {
      setError(null);
      await upsertUserProfile(uid, nextProfile);
      setProfile((current) => ({ ...current, ...nextProfile, uid } as UserModel));
    } catch (nextError) {
      console.error(nextError);
      setError(getFirebaseErrorMessage(nextError));
    }
  }

  return { profile, error, saveProfile };
}
