import { create } from 'zustand';

interface UserState {
  name: string | null;
  email: string | null;
  major: string | null;
  studentId: string | null;
  refresh: string | null;
  access: string | null;
  isLoggedIn: boolean; // 로그인 여부 확인
  setUser: (userData: Partial<UserState>) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  name: null,
  email: null,
  major: null,
  studentId: null,
  refresh: localStorage.getItem("token") || null,
  access: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"), // 초기값 설정

  setUser: (userData) => set((state) => ({
    ...state,
    ...userData,
    isLoggedIn: !!userData.refresh,
  })),

  logout: () => {
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("accessToken");
    set({
      name: null,
      email: null,
      major: null,
      studentId: null,
      refresh: null,
      access: null,
      isLoggedIn: false, // 로그아웃 시 로그인 상태 해제
    });
  },
}));

export default useUserStore;