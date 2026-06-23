"use client";

import { useEffect, useState } from "react";
import type { PostModel } from "@/models/PostModel";
import { createPost, subscribeToPosts } from "@/services/databaseService";
import { getFirebaseErrorMessage } from "@/services/firebaseClient";

export function usePostViewModel(uid?: string, displayName?: string | null) {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      return subscribeToPosts(setPosts);
    } catch (nextError) {
      console.error(nextError);
      setError(getFirebaseErrorMessage(nextError));
    }
  }, []);

  async function submitPost(title: string, body: string) {
    if (!uid) {
      throw new Error("Login is required to write posts.");
    }

    setIsSaving(true);
    try {
      setError(null);
      await createPost({
        authorId: uid,
        authorName: displayName || "Success Hub member",
        title,
        body,
        imageUrls: [],
        likeCount: 0
      });
    } catch (nextError) {
      console.error(nextError);
      setError(getFirebaseErrorMessage(nextError));
    } finally {
      setIsSaving(false);
    }
  }

  return { posts, isSaving, error, submitPost };
}
