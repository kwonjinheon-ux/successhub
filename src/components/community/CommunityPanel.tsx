"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { usePosts } from "@/hooks/usePosts";

export function CommunityPanel({ compact = false }: { compact?: boolean }) {
  const auth = useAuth();
  const { posts, isSaving, error, submitPost } = usePosts(auth.user?.uid, auth.user?.displayName);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitPost(title, body);
    setTitle("");
    setBody("");
  }

  return (
    <section className="panel">
      <h2>Community</h2>
      {!compact ? (
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Title
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>
          <label>
            Body
            <textarea value={body} onChange={(event) => setBody(event.target.value)} required />
          </label>
          <Button disabled={isSaving || !auth.user} type="submit">
            Publish post
          </Button>
        </form>
      ) : null}
      {error ? <p className="error">{error}</p> : null}
      <div className="list">
        {posts.slice(0, compact ? 3 : 20).map((post) => (
          <article className="list-item" key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <span>{post.authorName}</span>
          </article>
        ))}
        {posts.length === 0 ? <p className="muted">No posts yet.</p> : null}
      </div>
    </section>
  );
}
