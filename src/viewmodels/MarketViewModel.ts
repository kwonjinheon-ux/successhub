"use client";

import { useEffect, useState } from "react";
import type { MarketItemModel } from "@/models/MarketItemModel";
import { createMarketItem, subscribeToMarketItems } from "@/services/databaseService";
import { getFirebaseErrorMessage } from "@/services/firebaseClient";

export function useMarketViewModel(uid?: string, displayName?: string | null) {
  const [items, setItems] = useState<MarketItemModel[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      return subscribeToMarketItems(setItems);
    } catch (nextError) {
      console.error(nextError);
      setError(getFirebaseErrorMessage(nextError));
    }
  }, []);

  async function submitMarketItem(title: string, description: string, price: number, location: string) {
    if (!uid) {
      throw new Error("Login is required to create market items.");
    }

    setIsSaving(true);
    try {
      setError(null);
      await createMarketItem({
        sellerId: uid,
        sellerName: displayName || "Success Hub member",
        title,
        description,
        price,
        location,
        status: "available",
        imageUrls: []
      });
    } catch (nextError) {
      console.error(nextError);
      setError(getFirebaseErrorMessage(nextError));
    } finally {
      setIsSaving(false);
    }
  }

  return { items, isSaving, error, submitMarketItem };
}
