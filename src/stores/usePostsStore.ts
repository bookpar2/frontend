import { create } from 'zustand';
import { PostsState, Book } from '../dataType';

// Mock 데이터 추가
const mockBooks: Book[] = [
  {
    book_id: 1,
    title: "쉽게 배우는 파이썬",
    price: 2000,
    description: "책 상태가 매우 좋고 매우 좋다!!",
    saleStatus: false,
    seller: "김커밋",
    imageUrls: []
  },
  {
    book_id: 2,
    title: "알고리즘 문제 해결 전략",
    price: 15000,
    description: "필기 흔적 있음, 전체적으로 깨끗함",
    saleStatus: true,
    seller: "박커밋",
    imageUrls: []
  }
];

const usePostsStore = create<PostsState>((set, get) => ({
  books: [],
  loading: false,
  error: null,

  fetchBooks: async () => {
    // 이미 데이터가 있으면 중복 요청 방지
    if (get().books.length > 0) return;

    set({ loading: true, error: null }); // 로딩 시작
    try {
      // API가 아직 없으므로 Mock 데이터 사용
      await new Promise((resolve) => setTimeout(resolve, 1000)); // 1초 딜레이
      set({ books: mockBooks, loading: false });
    } catch (error) {
      console.error(error);
      set({ error: "데이터를 불러오는 중 문제가 발생했습니다.", loading: false });
    }
  }
}));

export default usePostsStore;
