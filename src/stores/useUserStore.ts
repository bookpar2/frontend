import { create } from 'zustand';

export type UserState = {
  isLoggedIn: boolean;
  email: string;
  id: number;
  name: string;
  studentId: string;
  setUser: (user: Omit<UserState, 'setUser'>) => void;
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