import { create } from 'zustand';

interface UserState {
  id: string | null;
  name: string | null;
  school_email: string | null;
  major: string | null;
  student_id: string | null;
  refresh: string | null;
  access: string | null;
  isLoggedIn: boolean; // 로그인 여부 확인
  setUser: (userData: Partial<UserState>) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  id: null,
  name: null,
  school_email: null,
  major: null,
  student_id: null,
  refresh: localStorage.getItem("refreshToken") || null,
  access: localStorage.getItem("accessToken") || null,
  isLoggedIn: !!localStorage.getItem("refreshToken"), // 초기값 설정

  setUser: (userData) => set((state) => ({
    ...state,
    ...userData,
    isLoggedIn: !!userData.refresh,
  })),

  logout: () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    set({
      id: null,
      name: null,
      school_email: null,
      major: null,
      student_id: null,
      refresh: null,
      access: null,
      isLoggedIn: false, // 로그아웃 시 로그인 상태 해제
    });
  },
}));

export default useUserStore;