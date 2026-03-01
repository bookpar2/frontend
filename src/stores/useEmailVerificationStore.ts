import { create } from "zustand";
import type { AxiosError } from "axios";
import api from "../baseURL/baseURL";

export type VerificationType = "registration" | "password_reset";

interface ApiErrorBody {
  message?: string;
}

interface EmailVerificationState {
  // 이메일 인증 플로우 공통 상태
  isSending: boolean; // 인증 메일 발송 로딩
  isVerifying: boolean; // 인증 코드 검증 로딩
  isEmailLocked: boolean; // 이메일 입력/버튼 잠금
  isCodeLocked: boolean; // 코드 입력/버튼 잠금
  isVerified: boolean; // 이메일+코드 검증 완료 여부

  // 에러 메시지
  emailError: string;
  codeError: string;

  // 에러 제어
  setEmailError: (message: string) => void;
  setCodeError: (message: string) => void;
  clearErrors: () => void;

  // 인증 메일 발송
  sendVerificationEmail: (params: { email: string; type: VerificationType }) => Promise<string>;

  // 인증 코드 검증
  verifyEmailCode: (params: { email: string; code: string }) => Promise<string>;

  // 인증 잠금 해제(재시도 허용)
  unlock: () => void;

  // 스토어 초기화(페이지 이동/언마운트 시 권장)
  reset: () => void;
}

const getApiMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<ApiErrorBody>;
  return axiosError.response?.data?.message || "요청 중 오류가 발생했습니다.";
};

const initialState = {
  isSending: false,
  isVerifying: false,
  isEmailLocked: false,
  isCodeLocked: false,
  isVerified: false,
  emailError: "",
  codeError: "",
};

const useEmailVerificationStore = create<EmailVerificationState>((set, get) => ({
  ...initialState,

  // 이메일 에러 설정
  setEmailError: (message) => set({ emailError: message }),

  // 인증코드 에러 설정
  setCodeError: (message) => set({ codeError: message }),

  // 에러 초기화
  clearErrors: () => set({ emailError: "", codeError: "" }),

  // 인증 메일 발송 API
  sendVerificationEmail: async ({ email, type }) => {
    // 이메일 잠금 상태면 요청 방지
    if (get().isEmailLocked) return "";

    set({ isSending: true });

    try {
      const response = await api.post("users/send-verification-email/", {
        school_email: email,
        verification_type: type,
      });

      // 이메일 관련 에러 초기화
      set({ emailError: "" });

      return String(response.data?.message ?? "인증 이메일이 발송되었습니다.");
    } catch (error: unknown) {
      const message = getApiMessage(error);
      set({ emailError: message });
      throw new Error(message);
    } finally {
      set({ isSending: false });
    }
  },

  // 인증 코드 검증 API
  verifyEmailCode: async ({ email, code }) => {
    // 코드 잠금 상태면 요청 방지
    if (get().isCodeLocked) return "";

    set({ isVerifying: true });

    try {
      const response = await api.post("users/verify-email-code/", {
        school_email: email,
        verification_code: code,
      });

      // 인증 성공 시 잠금 + 완료 처리
      set({
        isEmailLocked: true,
        isCodeLocked: true,
        isVerified: true,
        codeError: "",
        emailError: "",
      });

      return String(response.data?.message ?? "인증 코드가 확인되었습니다.");
    } catch (error: unknown) {
      const message = getApiMessage(error);
      set({ codeError: message || "인증에 실패했습니다. 다시 입력해 주세요." });
      throw new Error(message);
    } finally {
      set({ isVerifying: false });
    }
  },

  // 인증 잠금 해제(재인증 가능)
  unlock: () =>
    set({
      isEmailLocked: false,
      isCodeLocked: false,
      isVerified: false,
    }),

  // 전체 초기화
  reset: () => set({ ...initialState }),
}));

export default useEmailVerificationStore;
