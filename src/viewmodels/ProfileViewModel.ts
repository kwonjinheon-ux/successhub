"use client";

import { useEffect, useState } from "react";
import type { UserModel } from "@/models/UserModel";
import { readUserProfile, upsertUserProfile } from "@/services/databaseService";

export function useProfileViewModel(uid?: string) {
  const [profile, setProfile] = useState<UserModel | null>(null);

  useEffect(() => {
    if (!uid) {
      setProfile(null);
      return;
    }

    readUserProfile(uid).then(setProfile);
  }, [uid]);

  async function saveProfile(nextProfile: Partial<UserModel>) {
    if (!uid) {
      throw new Error("Login is required to update profile.");
    }

    await upsertUserProfile(uid, nextProfile);
    setProfile((current) => ({ ...current, ...nextProfile, uid } as UserModel));
  }

  return { profile, saveProfile };
}
