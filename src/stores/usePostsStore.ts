import { create } from "zustand";
import api from "../baseURL/baseURL";
import { PostsState } from "../dataType";

const usePostsStore = create<PostsState>((set) => ({
  books: [],
  loading: false,
  error: null,
  
  fetchBooks: async () => {
    set({ loading: true, error: null });
  
    try {
      const response = await api.get("books/all");
  
      const apiBooks = response.data.map((book: any) => ({
        book_id: book.id,
        images: book.images.map((img: any) => img.image_url) || [],
        title: book.title,
        price: book.price,
        saleStatus: book.status,
        description: book.description,
        seller: book.seller,
        seller_name: book.seller_name,
        chatLink: book.chatLink,
      }));         
  
      set({ books: apiBooks, loading: false });
    } catch (error) {
      console.error("도서 데이터 불러오기 오류:", error);
      set({
        error: "데이터를 불러오는 중 문제가 발생했습니다.",
        loading: false,
      });
    }
  },  
}));

export default usePostsStore;