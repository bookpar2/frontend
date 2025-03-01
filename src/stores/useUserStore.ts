import { create } from 'zustand';

interface UserState {
  name: string | null;
  email: string | null;
  major: string | null;
  studentId: string | null;
  token: string | null;
  isLoggedIn: boolean; // 로그인 여부 확인
  setUser: (userData: Partial<UserState>) => void;
  logout: () => void;
}

const useUserStore = create<UserState>((set) => ({
  name: null,
  email: null,
  major: null,
  studentId: null,
  token: localStorage.getItem("token") || null,
  isLoggedIn: !!localStorage.getItem("token"), // 초기값 설정

  setUser: (userData) => set((state) => ({
    ...state,
    ...userData,
    isLoggedIn: !!userData.token, // 토큰이 있으면 로그인 상태로 변경
  })),

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    set({
      name: null,
      email: null,
      major: null,
      studentId: null,
      token: null,
      isLoggedIn: false, // 로그아웃 시 로그인 상태 해제
    });
  },
}));

export default useUserStore;