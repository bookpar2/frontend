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
};

const useUserStore = create<UserState>((set) => ({
  isLoggedIn: true,
  email: '',
  id: 0,
  name: '',
  studentId: '',
  setUser: (user) => set({ ...user, isLoggedIn: true }),
  logout: () => set({ isLoggedIn: false, email: '', id: 0, name: '', studentId: '' }),
}));

export default useUserStore;