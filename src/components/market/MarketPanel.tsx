"use client";

import { FormEvent, useState } from "react";
import { Button } from "@/components/common/Button";
import { useAuth } from "@/hooks/useAuth";
import { useMarket } from "@/hooks/useMarket";

export function MarketPanel({ compact = false }: { compact?: boolean }) {
  const auth = useAuth();
  const { items, isSaving, error, submitMarketItem } = useMarket(auth.user?.uid, auth.user?.displayName);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [location, setLocation] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await submitMarketItem(title, description, Number(price), location);
    setTitle("");
    setDescription("");
    setPrice("0");
    setLocation("");
  }

  return (
    <section className="panel">
      <h2>Market</h2>
      {!compact ? (
        <form className="form-grid" onSubmit={handleSubmit}>
          <label>
            Item
            <input value={title} onChange={(event) => setTitle(event.target.value)} required />
          </label>
          <label>
            Description
            <textarea value={description} onChange={(event) => setDescription(event.target.value)} required />
          </label>
          <label>
            Price
            <input min="0" type="number" value={price} onChange={(event) => setPrice(event.target.value)} required />
          </label>
          <label>
            Location
            <input value={location} onChange={(event) => setLocation(event.target.value)} required />
          </label>
          <Button disabled={isSaving || !auth.user} type="submit">
            List item
          </Button>
        </form>
      ) : null}
      {error ? <p className="error">{error}</p> : null}
      <div className="list">
        {items.slice(0, compact ? 3 : 20).map((item) => (
          <article className="list-item" key={item.id}>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <span>
              ${item.price} · {item.location} · {item.status}
            </span>
          </article>
        ))}
        {items.length === 0 ? <p className="muted">No market items yet.</p> : null}
      </div>
    </section>
  );
}
