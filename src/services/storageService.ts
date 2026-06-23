"use client";

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { getFirebaseStorage } from "@/services/firebaseClient";

export async function uploadProfileImage(uid: string, file: File) {
  return uploadAndReturnUrl(`profiles/${uid}/${crypto.randomUUID()}-${file.name}`, file);
}

export async function uploadPostAttachment(uid: string, postId: string, file: File) {
  return uploadAndReturnUrl(`posts/${uid}/${postId}/${crypto.randomUUID()}-${file.name}`, file);
}

export async function uploadMarketImage(uid: string, itemId: string, file: File) {
  return uploadAndReturnUrl(`market/${uid}/${itemId}/${crypto.randomUUID()}-${file.name}`, file);
}

async function uploadAndReturnUrl(path: string, file: File) {
  const fileRef = ref(getFirebaseStorage(), path);
  await uploadBytes(fileRef, file, { contentType: file.type });
  return getDownloadURL(fileRef);
}
