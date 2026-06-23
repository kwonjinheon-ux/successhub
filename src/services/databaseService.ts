"use client";

import { get, onValue, push, ref, set, update } from "firebase/database";
import { getRealtimeDb } from "@/services/firebaseClient";
import type { MarketItemModel } from "@/models/MarketItemModel";
import type { PostModel } from "@/models/PostModel";
import type { UserModel } from "@/models/UserModel";

export function upsertUserProfile(uid: string, profile: Partial<UserModel>) {
  return update(ref(getRealtimeDb(), `users/${uid}`), {
    ...profile,
    updatedAt: new Date().toISOString()
  });
}

export async function createPost(post: Omit<PostModel, "id" | "createdAt" | "updatedAt">) {
  const postRef = push(ref(getRealtimeDb(), "posts"));
  const now = new Date().toISOString();
  await set(postRef, { ...post, id: postRef.key, createdAt: now, updatedAt: now });
  return postRef.key;
}

export async function createMarketItem(item: Omit<MarketItemModel, "id" | "createdAt" | "updatedAt">) {
  const itemRef = push(ref(getRealtimeDb(), "marketItems"));
  const now = new Date().toISOString();
  await set(itemRef, { ...item, id: itemRef.key, createdAt: now, updatedAt: now });
  return itemRef.key;
}

export async function markMarketItemSold(itemId: string, sellerId: string) {
  await update(ref(getRealtimeDb(), `marketItems/${itemId}`), {
    sellerId,
    status: "sold",
    updatedAt: new Date().toISOString()
  });
}

export function subscribeToPosts(callback: (posts: PostModel[]) => void) {
  return onValue(ref(getRealtimeDb(), "posts"), (snapshot) => {
    const value = snapshot.val() as Record<string, PostModel> | null;
    callback(value ? Object.values(value) : []);
  });
}

export function subscribeToMarketItems(callback: (items: MarketItemModel[]) => void) {
  return onValue(ref(getRealtimeDb(), "marketItems"), (snapshot) => {
    const value = snapshot.val() as Record<string, MarketItemModel> | null;
    callback(value ? Object.values(value) : []);
  });
}

export async function readUserProfile(uid: string) {
  const snapshot = await get(ref(getRealtimeDb(), `users/${uid}`));
  return snapshot.val() as UserModel | null;
}
