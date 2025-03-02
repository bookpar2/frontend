import { create } from "zustand";
import api from "../baseURL/baseURL"; // Axios 인스턴스 추가
import { PostsState } from "../dataType";

const usePostsStore = create<PostsState>((set, get) => ({
  books: [],
  loading: false,
  error: null,
  
  fetchBooks: async () => {
    if (get().books.length > 0) return;
  
    set({ loading: true, error: null });
  
    try {
      // 로컬 스토리지에서 JWT 토큰 가져오기
      const token = localStorage.getItem("accessToken");
  
      // 요청 헤더에 Authorization 추가
      const response = await api.get("books/", {
        headers: {
          Authorization: `Bearer ${token}`, // JWT 토큰 추가
        },
      });
  
      const apiBooks = response.data.map((book: any) => ({
        book_id: book.id,
        title: book.title,
        price: book.price,
        description: book.description,
        saleStatus: book.status === "FOR_SALE",
        seller: book.seller,
        imageUrls: book.image_url ? [book.image_url] : [],
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