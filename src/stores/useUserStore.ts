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
  refreshAccessToken: () => Promise<void>;
  autoLogin: () => void;
  logout: () => void;
}

// sessionStorage에서 초기 값 가져오기
const storedUser = sessionStorage.getItem("user");
const initialUser: UserState = storedUser
  ? JSON.parse(storedUser)
  : {
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
          ...useUserStore.getState(), // 기존 상태 유지
          ...userData,
          isLoggedIn: !!userData.refresh,
        };
    
        sessionStorage.setItem("user", JSON.stringify(newUserState)); // sessionStorage에 저장
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
    }
  )
);    

export default useUserStore;