"use client";

import { useEffect, useState } from "react";
import type { MarketItemModel } from "@/models/MarketItemModel";
import { createMarketItem, subscribeToMarketItems } from "@/services/databaseService";

export function useMarketViewModel(uid?: string, displayName?: string | null) {
  const [items, setItems] = useState<MarketItemModel[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => subscribeToMarketItems(setItems), []);

  async function submitMarketItem(title: string, description: string, price: number, location: string) {
    if (!uid) {
      throw new Error("Login is required to create market items.");
    }

    setIsSaving(true);
    try {
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
    } finally {
      setIsSaving(false);
    }
  }

  return { items, isSaving, submitMarketItem };
}
