export interface PostModel {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  body: string;
  imageUrls?: string[];
  likeCount?: number;
  createdAt: string;
  updatedAt: string;
}
