export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverUrl: string; // Used for Picsum or generated images
  genre: string;
  rating: number;
  purchaseUrl?: string; // Optional custom purchase link
}

export interface GeneratedBookResponse {
  books: Book[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}