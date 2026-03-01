import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../baseURL/baseURL";
import { validateEmail } from "../utils/email";
import type { AxiosError } from "axios";

// 비밀번호 재설정 페이지
const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  // 이메일 인증 요청 로딩 상태
  const [isVerifyingEmail, setIsVerifyingEmail] = useState(false);
  // 인증 코드 확인 로딩 상태
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  // 이메일 입력/인증 잠금 상태
  const [isEmailLocked, setIsEmailLocked] = useState(false);
  // 인증코드 입력/확인 잠금 상태
  const [isCodeLocked, setIsCodeLocked] = useState(false);
  // 이메일+코드 인증 완료 여부(비밀번호 재설정 요청 허용)
  const [isAuthVerified, setIsAuthVerified] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  // axios 에러 메시지 추출 유틸
  const getApiMessage = (error: unknown): string => {
    const axiosError = error as AxiosError<{ message?: string }>;
    return axiosError.response?.data?.message || "요청 중 오류가 발생했습니다.";
  };

  // 인증 입력/버튼 잠금 해제
  const unlockAuth = () => {
    setIsEmailLocked(false);
    setIsCodeLocked(false);
    setIsAuthVerified(false);
  };

  // 이메일 인증 요청 (API 호출)
  const handleEmailVerification = async () => {
    // 인증 완료 후에는 재요청 방지
    if (isEmailLocked) return;

    const tempErrors = { ...errors };

    if (!validateEmail(email)) {
      tempErrors.email = "이메일 형식이 올바르지 않습니다 (@tukorea.ac.kr 도메인 사용)";
      setErrors(tempErrors);
      return;
    }

    setIsVerifyingEmail(true); // 인증 요청 중 상태 변경

    try {
      const response = await api.post("users/send-verification-email/", {
        school_email: email,
        verification_type: "password_reset",
      });

      alert(response.data.message); // "인증 이메일이 발송되었습니다."
      setErrors({ ...tempErrors, email: "" });
    } catch (error: unknown) {
      console.error("이메일 인증 오류:", error);
      setErrors({ ...tempErrors, email: getApiMessage(error) });
    } finally {
      setIsVerifyingEmail(false); // 요청 완료 후 버튼 활성화
    }
  };

  // 인증 코드 확인 API 호출
  const handleVerifyCode = async () => {
    // 인증 완료 후에는 재요청 방지
    if (isCodeLocked) return;

    const tempErrors = { ...errors };

    if (!validateEmail(email)) {
      setErrors({
        ...tempErrors,
        email: "이메일 형식이 올바르지 않습니다 (@tukorea.ac.kr 도메인 사용)",
      });
      return;
    }

    if (!verificationCode) {
      setErrors({ ...tempErrors, verificationCode: "인증 코드를 입력해 주세요." });
      return;
    }

    setIsVerifyingCode(true); // 인증 코드 확인 중 상태 변경

    try {
      const response = await api.post("users/verify-email-code/", {
        school_email: email,
        verification_code: verificationCode,
      });

      alert(response.data.message); // "인증 코드가 확인되었습니다."

      // 인증 성공 시: 이메일/코드 입력과 버튼 잠금 + 인증 완료 플래그 on
      setIsEmailLocked(true);
      setIsCodeLocked(true);
      setIsAuthVerified(true);

      setErrors({ ...tempErrors, verificationCode: "" });
    } catch (error: unknown) {
      console.error("인증 코드 확인 오류:", error);
      setErrors({ ...tempErrors, verificationCode: "인증에 실패했습니다. 다시 입력해 주세요." });
    } finally {
      setIsVerifyingCode(false); // 요청 완료 후 버튼 활성화
    }
  };

  // 비밀번호 재설정 API
  const submitResetPassword = async () => {
    // 유효성 검사
    const tempErrors = { ...errors };

    if (!validateEmail(email)) tempErrors.email = "학교 이메일 형식이 올바르지 않습니다.";
    if (!verificationCode) tempErrors.verificationCode = "이메일 인증 코드를 입력해 주세요.";
    if (!password) tempErrors.password = "비밀번호를 입력해 주세요.";
    if (password.length < 8) tempErrors.password = "비밀번호는 8자리 이상이어야 합니다.";
    if (password !== confirmPassword) tempErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";

    // 인증이 완료되지 않았으면 재설정 요청 자체를 막기
    if (!isAuthVerified) {
      tempErrors.verificationCode = "이메일 인증을 완료해 주세요.";
    }

    setErrors(tempErrors);

    // 오류가 없으면 비밀번호 재설정 요청
    if (Object.values(tempErrors).every((error) => error === "")) {
      try {
        await api.post("users/password-reset-confirm/", {
          school_email: email,
          new_password: password,
          verification_code: verificationCode,
        });

        alert("비밀번호 재설정 성공! 로그인 페이지로 이동합니다.");
        navigate("/login");
      } catch (error: unknown) {
        console.error("비밀번호 재설정 오류:", error);

        // 재설정 실패 시에만 다시 인증 가능하도록 잠금 해제
        unlockAuth();

        setErrors({
          ...errors,
          email: getApiMessage(error),
        });
      }
    }
  };

  // 폼 기본 submit은 막고 submitResetPassword만 실행
  const handleResetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    void submitResetPassword();
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-10 py-20">
      <h1 className="text-2xl font-bold mb-8">비밀번호 재설정</h1>

      <form onSubmit={handleResetPassword} className="w-full max-w-sm">
        {/* 이메일 입력 */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-900 text-[10px] sm:text-xs pb-1 pl-1">
            학교 이메일
          </label>
          <div className="flex">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="학교 이메일을 입력해 주세요"
              disabled={isEmailLocked}
              className={`w-4/5 p-3 border mr-2 ${
                errors.email ? "border-alert" : "border-gray-700"
              } rounded-lg focus:outline-none focus:border-primary text-[10px] sm:text-xs placeholder:text-gray-700 disabled:bg-gray-500/10`}
            />
            <button
              type="button"
              onClick={handleEmailVerification}
              disabled={isVerifyingEmail || isEmailLocked}
              className={`w-1/5 text-white bg-primary hover:bg-primary/80 rounded-lg text-[10px] sm:text-xs ${
                isVerifyingEmail || isEmailLocked
                  ? "cursor-not-allowed opacity-60"
                  : "cursor-pointer"
              }`}
            >
              {isVerifyingEmail ? "전송 중..." : isEmailLocked ? "완료" : "인증"}
            </button>
          </div>
          {errors.email && <p className="text-alert text-xs mt-2">{errors.email}</p>}
        </div>

        {/* 인증코드 입력란 */}
        <div className="mb-4">
          <label
            htmlFor="verificationCode"
            className="block text-gray-900 text-[10px] sm:text-xs pb-1 pl-1"
          >
            인증코드 입력
          </label>
          <div className="flex">
            <input
              type="text"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증코드를 입력해 주세요"
              disabled={isCodeLocked}
              className={`w-4/5 p-3 border mr-2 ${
                errors.verificationCode ? "border-alert" : "border-gray-700"
              } rounded-lg focus:outline-none focus:border-primary text-[10px] sm:text-xs placeholder:text-gray-700 disabled:bg-gray-500/10`}
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              disabled={isVerifyingCode || isCodeLocked}
              className={`w-1/5 text-white bg-primary hover:bg-primary/80 rounded-lg text-[10px] sm:text-xs ${
                isVerifyingCode || isCodeLocked ? "cursor-not-allowed opacity-60" : "cursor-pointer"
              }`}
            >
              {isVerifyingCode ? "확인 중..." : isCodeLocked ? "완료" : "확인"}
            </button>
          </div>
          {errors.verificationCode && (
            <p className="text-alert text-xs mt-2">{errors.verificationCode}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-900 text-[10px] sm:text-xs pb-1 pl-1"
          >
            새 비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요"
            className={`w-full p-3 border ${
              errors.password ? "border-alert" : "border-gray-700"
            } rounded-lg focus:outline-none focus:border-primary text-[10px] sm:text-xs placeholder:text-gray-700`}
          />
          {errors.password && <p className="text-alert text-xs mt-2">{errors.password}</p>}
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-8">
          <label
            htmlFor="confirm_password"
            className="block text-gray-900 text-[10px] sm:text-xs pb-1 pl-1"
          >
            새 비밀번호 확인
          </label>
          <input
            type="password"
            id="confirm_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 다시 입력해 주세요"
            className={`w-full p-3 border ${
              errors.confirmPassword ? "border-alert" : "border-gray-700"
            } rounded-lg focus:outline-none focus:border-primary text-[10px] sm:text-xs placeholder:text-gray-700`}
          />
          {errors.confirmPassword && (
            <p className="text-alert text-xs mt-2">{errors.confirmPassword}</p>
          )}
        </div>

        {/* 비밀번호 재설정 버튼 */}
        <button
          type="submit"
          className="w-full py-3 text-white text-sm bg-primary hover:bg-primary/80 rounded-full transition duration-200 cursor-pointer"
        >
          확인
        </button>
      </form>
    </div>
  );
};

export default ResetPasswordPage;
