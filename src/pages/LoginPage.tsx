import React, { useState } from "react";
import api from "../baseURL/baseURL";
import useUserStore from "../stores/useUserStore";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const { setUser } = useUserStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [emailError, setEmailError] = useState("");
  const [loginError, setLoginError] = useState("");

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@tukorea.ac.kr$/;
    return regex.test(email);
  };

  const moveToMainPage = () => {
    navigate("/");
  };

  // 이메일 입력 시 실시간 검사
  const handleEmailChange = (value: string) => {
    setEmail(value);

    if (!validateEmail(value)) {
      setEmailError("이메일 형식이 올바르지 않습니다 (@tukorea.ac.kr 도메인 사용)");
    } else {
      setEmailError("");
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    // 이메일 형식 최종 체크
    if (!validateEmail(email)) {
      setEmailError("이메일 형식이 올바르지 않습니다 (@tukorea.ac.kr 도메인 사용)");
      return;
    }

    try {
      const response = await api.post("users/login/", {
        school_email: email,
        password: password,
      });

      setLoginError("");
      setUser(response.data);

      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("accessToken", response.data.access);

      moveToMainPage();
    } catch (error: any) {
      setLoginError("아이디 또는 비밀번호가 맞지 않습니다.");
    }
  };

  return (
    <div className="h-full flex flex-col items-center justify-center px-10 py-20">
      <h1 className="text-2xl font-bold mb-8">로그인</h1>

      <form onSubmit={handleLogin} className="w-full max-w-sm">
        {/* 이메일 입력 */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-900 pb-1 pl-2 text-[10px] sm:text-xs">
            학교 이메일
          </label>

          <input
            type="email"
            id="email"
            placeholder="학교 이메일을 입력해 주세요"
            value={email}
            onChange={(e) => handleEmailChange(e.target.value)}
            className={`text-gray-700 w-full p-3 border ${
              emailError ? "border-alert" : "border-gray-700"
            } text-[10px] sm:text-xs rounded-lg focus:outline-none focus:border-primary placeholder:text-gray-700`}
          />

          {emailError && (
            <p className="text-alert text-[10px] sm:text-xs mt-2 pl-2">{emailError}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-8">
          <label
            htmlFor="password"
            className="block text-gray-900 pb-1 pl-2 text-[10px] sm:text-xs"
          >
            비밀번호
          </label>

          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="text-gray-700 text-[10px] sm:text-xs w-full p-3 border border-gray-700 rounded-lg focus:outline-none focus:border-primary placeholder:text-gray-700"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="text-sm w-full py-3 text-primary bg-white hover:bg-primary hover:text-white border border-primary rounded-full transition duration-200"
        >
          로그인
        </button>
      </form>

      {/* 로그인 실패 에러 */}
      {loginError && <p className="text-alert text-sm mt-4">{loginError}</p>}

      {/* 비밀번호 재설정 안내 */}
      <p className="mt-8 flex gap-2 text-gray-700 font-medium text-xs sm:text-sm">
        비밀번호를 잊으셨나요?
        <a href="/password" className="text-primary hover:underline">
          비밀번호 재설정
        </a>
      </p>

      {/* 회원가입 안내 */}
      <p className="mt-2 flex gap-2 text-gray-700 font-medium text-xs sm:text-sm">
        회원이 아니신가요?
        <a href="/register" className="text-primary hover:underline">
          회원가입
        </a>
      </p>
    </div>
  );
};

export default LoginPage;
