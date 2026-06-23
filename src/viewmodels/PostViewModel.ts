"use client";

import { useEffect, useState } from "react";
import type { PostModel } from "@/models/PostModel";
import { createPost, subscribeToPosts } from "@/services/databaseService";

export function usePostViewModel(uid?: string, displayName?: string | null) {
  const [posts, setPosts] = useState<PostModel[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => subscribeToPosts(setPosts), []);

  async function submitPost(title: string, body: string) {
    if (!uid) {
      throw new Error("Login is required to write posts.");
    }

    setIsSaving(true);
    try {
      await createPost({
        authorId: uid,
        authorName: displayName || "Success Hub member",
        title,
        body,
        imageUrls: [],
        likeCount: 0
      });
    } finally {
      setIsSaving(false);
    }
  }

  return { posts, isSaving, submitPost };
}
