export type AuthProvider = "password" | "google" | "facebook" | "apple" | "phone";

export interface UserModel {
  uid: string;
  email?: string | null;
  phoneNumber?: string | null;
  displayName?: string | null;
  photoURL?: string | null;
  provider: AuthProvider;
  trustScore?: number;
  points?: number;
  createdAt?: string;
  updatedAt?: string;
}
