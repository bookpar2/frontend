import { create } from "zustand";
import { persist } from "zustand/middleware";
import api from "../baseURL/baseURL";

export interface BookImage {
  image_url: string;
}

export interface Book {
  id: number;
  title: string;
  chatLink: string;
  price: number;
  major: string;
  status: string;
  description: string;
  images: BookImage[];
}

interface BookState {
  currentBook: Book | null;
  loading: boolean;
  fetchBook: (bookId: string) => Promise<void>;
  clearBook: () => void;
}

const useBookStore = create<BookState>()(
  persist(
    (set) => ({
      currentBook: null,
      loading: false,

      fetchBook: async (bookId: string) => {
        try {
          set({ loading: true });

          const token = localStorage.getItem("accessToken");
          const response = await api.get(`books/${bookId}/`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          set({
            currentBook: response.data,
            loading: false,
          });
        } catch (error) {
          console.error("책 불러오기 실패:", error);
          set({ loading: false });
        }
      },

      clearBook: () => set({ currentBook: null }),
    }),
    {
      name: "current-book-storage", 
    }
  )
);

export default useBookStore;
