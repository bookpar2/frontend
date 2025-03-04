export interface Book {
  book_id: number;
  images: string[]; // 여러 개의 이미지 배열 유지
  title: string;
  price: number;
  saleStatus: string;
  description: string;
  seller: string;
  seller_name: string;
  chatLink: string;
}

export interface PostsState {
  books: Book[];
  fetchBooks: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

export interface SalesStatusProps {
  saleStatus: string;
}

export interface PostCardProps {
  book_id: number;
  title: string;
  price: number;
  saleStatus: string;
  image_url: string;
}