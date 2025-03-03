import { create } from "zustand";

interface UserState {
  id: string | null;
  name: string | null;
  school_email: string | null;
  major: string | null;
  student_id: string | null;
  refresh: string | null;
  access: string | null;
  isLoggedIn: boolean;
  setUser: (userData: Partial<UserState>) => void;
  logout: () => void;
}

const storedUser = sessionStorage.getItem("user");
const initialUser = storedUser ? JSON.parse(storedUser) : {
  id: null,
  name: null,
  school_email: null,
  major: null,
  student_id: null,
  refresh: null,
  access: null,
  isLoggedIn: false,
};

const useUserStore = create<UserState>((set) => ({
  ...initialUser, 

  setUser: (userData) => {
    const newUserState = {
      ...userData,
      isLoggedIn: !!userData.refresh,
    };

    sessionStorage.setItem("user", JSON.stringify(newUserState)); // 🔹 sessionStorage에 저장
    set(newUserState);
  },

  logout: () => {
    sessionStorage.removeItem("user");
    set({
      id: null,
      name: null,
      school_email: null,
      major: null,
      student_id: null,
      refresh: null,
      access: null,
      isLoggedIn: false,
    });
  },
}));

export default useUserStore;