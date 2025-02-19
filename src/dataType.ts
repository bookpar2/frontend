export interface Book {
  book_id: number;
  imageUrls: string[];
  title: string;
  price: number;
  saleStatus: string;
}

export interface PostsState {
  books: Book[];
  fetchBooks: () => Promise<void>;
}

export interface SalesStatusProps {
  salesStatus: boolean;
}

export interface PostCardProps {
  title: string;
  price: string;
  salesStatus: boolean;
}