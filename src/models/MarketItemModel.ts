export type MarketItemStatus = "available" | "reserved" | "sold";

export interface MarketItemModel {
  id: string;
  sellerId: string;
  sellerName: string;
  title: string;
  description: string;
  price: number;
  location: string;
  status: MarketItemStatus;
  imageUrls?: string[];
  createdAt: string;
  updatedAt: string;
}
