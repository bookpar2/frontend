import { create } from 'zustand';
import api from '../baseURL/baseURL'; // Axios 인스턴스

interface VerificationState {
  loading: boolean;
  error: string | null;
  success: boolean;
  sendVerificationEmail: (email: string) => Promise<void>;
  verifyEmailCode: (email: string, code: string) => Promise<boolean>;
}

const useVerificationStore = create<VerificationState>((set) => ({
  loading: false,
  error: null,
  success: false,

  // 이메일 인증 코드 요청
  sendVerificationEmail: async (email) => {
    set({ loading: true, error: null, success: false });

    try {
      const response = await api.post("users/send-verification-email/", {
        school_email: email,
        verification_type: "registration",
      });

      set({ loading: false, success: true });
      alert(response.data.message); // "인증 이메일이 발송되었습니다."
    } catch (error: any) {
      console.error("이메일 인증 요청 오류:", error.response?.data);
      set({
        loading: false,
        success: false,
        error: error.response?.data?.message || "이메일 인증 요청 중 오류가 발생했습니다.",
      });
    }
  },

  // 이메일 인증 코드 검증
  verifyEmailCode: async (email, code) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post("users/verify-email-code/", {
        school_email: email,
        verification_code: code,
      });

      set({ loading: false, success: true });
      alert(response.data.message); // "인증 코드가 확인되었습니다."
      return true;
    } catch (error: any) {
      console.error("인증 코드 확인 오류:", error.response?.data);
      set({
        loading: false,
        success: false,
        error: error.response?.data?.message || "인증 코드 확인 중 오류가 발생했습니다.",
      });
      return false;
    }
  },
}));

export default useVerificationStore;