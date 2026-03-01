import React, { useEffect, useState } from "react";
import api from "../baseURL/baseURL";
import { useNavigate } from "react-router-dom";
import { majors } from "../constants/major";
import { validateEmail } from "../utils/email";
import useEmailVerificationStore from "../stores/useEmailVerificationStore";
import type { AxiosError } from "axios";

interface ApiErrorBody {
  message?: string;
}

const getApiMessage = (error: unknown): string => {
  const axiosError = error as AxiosError<ApiErrorBody>;
  return axiosError.response?.data?.message || "요청 중 오류가 발생했습니다.";
};

const RegisterPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [major, setMajor] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");

  const {
    isSending,
    isVerifying,
    isEmailLocked,
    isCodeLocked,
    isVerified,
    emailError,
    codeError,
    sendVerificationEmail,
    verifyEmailCode,
    reset,
  } = useEmailVerificationStore();

  // UI에서 쓰는 로딩 플래그 이름 유지
  const isVerifyingEmail = isSending;
  const isCheckingCode = isVerifying;

  const [errors, setErrors] = useState({
    name: "",
    studentId: "",
    major: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  useEffect(() => {
    return () => reset();
  }, [reset]);

  // 이메일 인증 요청
  const handleEmailVerification = async () => {
    const tempErrors = { ...errors };

    if (!validateEmail(email)) {
      tempErrors.email = "이메일 형식이 올바르지 않습니다 (@tukorea.ac.kr 도메인 사용)";
      setErrors(tempErrors);
      return;
    }

    try {
      const message = await sendVerificationEmail({ email, type: "registration" });
      if (message) alert(message);

      // store 에러/로컬 에러 동기화
      tempErrors.email = "";
      setErrors(tempErrors);
    } catch (error: unknown) {
      tempErrors.email = emailError || getApiMessage(error);
      setErrors(tempErrors);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();

    const tempErrors = {
      name: "",
      studentId: "",
      major: "",
      email: "",
      password: "",
      confirmPassword: "",
      verificationCode: "",
    };

    if (!/^[가-힣\s]+$/.test(name)) tempErrors.name = "이름은 한글로 입력해 주세요.";
    if (!/^[0-9]{10}$/.test(studentId))
      tempErrors.studentId = "학번은 10자리 숫자 형식으로 입력해 주세요.";
    if (!majors.includes(major)) tempErrors.major = "전공을 선택해 주세요.";
    if (!validateEmail(email))
      tempErrors.email = "이메일 형식이 올바르지 않습니다 (@tukorea.ac.kr 도메인 사용)";
    if (password.length < 8) tempErrors.password = "비밀번호는 8자리 이상이어야 합니다.";
    if (password !== confirmPassword) tempErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";

    if (!isVerified)
      tempErrors.verificationCode = "인증코드가 일치하지 않습니다. 다시 시도해 주세요.";

    setErrors(tempErrors);

    if (Object.values(tempErrors).every((error) => error === "")) {
      alert("회원가입 성공!");
    }
  };

  // 인증 코드 확인 API 호출 
  const handleVerifyCode = async () => {
    const tempErrors = { ...errors };

    if (!verificationCode) {
      tempErrors.verificationCode = "인증 코드를 입력해 주세요.";
      setErrors(tempErrors);
      return;
    }

    try {
      const message = await verifyEmailCode({ email, code: verificationCode });
      if (message) alert(message);

      // store 에러/로컬 에러 동기화
      setErrors({ ...tempErrors, verificationCode: "" });
    } catch (error: unknown) {
      tempErrors.verificationCode = codeError || "인증에 실패했습니다. 다시 입력해 주세요.";
      setErrors(tempErrors);
    }
  };

  // 회원가입 API
  const handleRegisterUser = async () => {
    const tempErrors = { ...errors };

    if (!name) tempErrors.name = "이름을 입력해 주세요.";
    if (!studentId) tempErrors.studentId = "학번을 입력해 주세요.";
    if (!major) tempErrors.major = "전공을 입력해 주세요.";
    if (!validateEmail(email)) tempErrors.email = "학교 이메일 형식이 올바르지 않습니다.";
    if (!verificationCode) tempErrors.verificationCode = "이메일 인증 코드를 입력해 주세요.";
    if (!password) tempErrors.password = "비밀번호를 입력해 주세요.";
    if (password !== confirmPassword) tempErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";

    // 인증 완료 전이면 회원가입 요청 막기
    if (!isVerified) tempErrors.verificationCode = "이메일 인증을 완료해 주세요.";

    setErrors(tempErrors);

    if (Object.values(tempErrors).every((error) => error === "")) {
      try {
        await api.post("users/register/", {
          school_email: email,
          password: password,
          name: name,
          student_id: studentId,
          major: major,
          verification_code: verificationCode,
        });

        alert("회원가입 성공! 로그인 페이지로 이동합니다.");
        navigate("/login");
      } catch (error: unknown) {
        console.error("회원가입 오류:", error);

        setErrors({
          ...errors,
          email: getApiMessage(error),
        });
      }
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-10 py-20">
      <h1 className="text-2xl font-bold mb-8">회원가입</h1>
      <form onSubmit={handleRegister} className="w-full max-w-sm">
        {/* 이름 입력 */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-900 text-[10px] sm:text-xs pb-1 pl-1">
            이름
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해 주세요"
            className={`w-full p-3 border ${errors.name ? "border-alert" : "border-gray-700"} rounded-lg focus:outline-none focus:border-primary text-[10px] sm:text-xs placeholder:text-gray-700`}
          />
          {errors.name && <p className="text-alert text-xs mt-2">{errors.name}</p>}
        </div>

        {/* 학번 입력 */}
        <div className="mb-4">
          <label
            htmlFor="student_id"
            className="block text-gray-900 text-[10px] sm:text-xs pb-1 pl-1"
          >
            학번
          </label>
          <input
            type="text"
            id="student_id"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="학번을 입력해 주세요"
            className={`w-full p-3 border ${errors.studentId ? "border-alert" : "border-gray-700"} rounded-lg focus:outline-none focus:border-primary text-[10px] sm:text-xs placeholder:text-gray-700`}
          />
          {errors.studentId && <p className="text-alert text-xs mt-2">{errors.studentId}</p>}
        </div>

        {/* 전공 선택 Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-900 pb-1 pl-1 text-[10px] sm:text-xs">전공</label>
          <div className="relative">
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className={`appearance-none w-full p-3 border rounded-lg pr-10 text-xs ${
                major ? "border-primary" : "border-gray-700"
              }`}
            >
              <option value="" className="text-gray-900 text-[10px] sm:text-xs">
                전공을 선택하세요
              </option>
              {majors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {/* 화살표 아이콘 */}
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="w-5 h-5 text-gray-800"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
          {errors.major && <p className="text-alert text-xs mt-2">{errors.major}</p>}
        </div>

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
              className={`w-4/5 p-3 border mr-2 ${errors.email ? "border-alert" : "border-gray-700"} rounded-lg focus:outline-none focus:border-primary text-[10px] sm:text-xs placeholder:text-gray-700`}
            />
            <button
              type="button"
              onClick={handleEmailVerification}
              className={`w-1/5 text-white bg-primary hover:bg-primary/80 rounded-lg text-[10px] sm:text-xs ${isVerifyingEmail ? "cursor-none" : "cursor-pointer"}`}
              disabled={isVerifyingEmail || isEmailLocked}
            >
              {isVerifyingEmail ? "전송 중..." : "인증"}
            </button>
          </div>
          {(errors.email || emailError) && (
            <p className="text-alert text-xs mt-2">{errors.email || emailError}</p>
          )}
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
              type="input"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증코드를 입력해 주세요"
              disabled={isCodeLocked}
              className={`w-4/5 p-3 border mr-2 ${errors.verificationCode == "유효하지 않은 인증 코드입니다." ? "border-alert" : "border-gray-700"} rounded-lg focus:outline-none focus:border-primary text-[10px] sm:text-xs placeholder:text-gray-700`}
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              className={`w-1/5 text-white bg-primary hover:bg-primary/80 rounded-lg text-[10px] sm:text-xs ${isCheckingCode ? "cursor-none" : "cursor-pointer"}`}
              disabled={isCheckingCode || isCodeLocked}
            >
              {isCheckingCode ? "전송 중..." : "확인"}
            </button>
          </div>
          {errors.verificationCode == "유효하지 않은 인증 코드입니다." ? (
            <p className="text-alert text-xs mt-2">{errors.verificationCode}</p>
          ) : (
            codeError && <p className="text-alert text-xs mt-2">{codeError}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-900 text-[10px] sm:text-[10px] sm:text-xs pb-1 pl-1"
          >
            비밀번호
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요"
            className={`w-full p-3 border ${errors.password ? "border-alert" : "border-gray-700"} rounded-lg focus:outline-none focus:border-primary text-[10px] sm:text-xs placeholder:text-gray-700`}
          />
          {errors.password && <p className="text-alert text-xs mt-2">{errors.password}</p>}
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-8">
          <label
            htmlFor="confirm_password"
            className="block text-gray-900 text-[10px] sm:text-xs pb-1 pl-1"
          >
            비밀번호 확인
          </label>
          <input
            type="password"
            id="confirm_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 다시 입력해 주세요"
            className={`w-full p-3 border ${errors.confirmPassword ? "border-alert" : "border-gray-700"} rounded-lg focus:outline-none focus:border-primary text-[10px] sm:text-xs placeholder:text-gray-700`}
          />
          {errors.confirmPassword && (
            <p className="text-alert text-xs mt-2">{errors.confirmPassword}</p>
          )}
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className="w-full py-3 text-white text-sm bg-primary hover:bg-primary/80 rounded-full transition duration-200 cursor-pointer"
          onClick={handleRegisterUser}
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
