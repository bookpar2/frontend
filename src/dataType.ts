export interface Book {
  book_id: number; 
  imageUrls: string[];
  title: string;
  price: number;
  saleStatus: boolean;
  description: string;
  seller: string;
}

export interface PostsState {
  books: Book[];
  fetchBooks: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface SalesStatusProps {
  saleStatus: boolean;
}

export interface PostCardProps {
  book_id: number;
  title: string;
  price: number;
  saleStatus: boolean;
  imageUrls: string[];
}