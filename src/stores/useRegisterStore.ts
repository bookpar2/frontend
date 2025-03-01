import { create } from 'zustand';
import api from '../baseURL/baseURL';
import useUserStore from './useUserStore';

interface RegisterState {
  loading: boolean;
  error: string | null;
  success: boolean;
  registerUser: (formData: RegisterFormData) => Promise<void>;
}

interface RegisterFormData {
  name: string;
  student_id: string;
  major: string;
  school_email: string;
  password: string;
  verification_code: string;
}

const useRegisterStore = create<RegisterState>((set) => ({
  loading: false,
  error: null,
  success: false,

  registerUser: async (formData) => {
    set({ loading: true, error: null, success: false });

    try {
      const response = await api.post("users/register/", formData);

      // 응답에서 JWT 토큰 저장
      const { access, refresh, name, school_email, major, student_id } = response.data;

      // 로그인 상태 업데이트
      useUserStore.getState().setUser({
        name,
        email: school_email,
        major,
        studentId: student_id,
        refresh: refresh,
        access: access
      });

      // 토큰 로컬 스토리지 저장
      localStorage.setItem("token", access);
      localStorage.setItem("refreshToken", refresh);

      set({ loading: false, success: true });

    } catch (error: any) {
      console.error("회원가입 오류:", error.response?.data);
      set({
        loading: false,
        success: false,
        error: error.response?.data?.detail || "회원가입 중 오류가 발생했습니다.",
      });
    }
  },
}));

export default useRegisterStore;