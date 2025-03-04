import React, { useState } from 'react';
import api from '../baseURL/baseURL';
import useUserStore from '../stores/useUserStore';
import { useNavigate } from 'react-router-dom';

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const { setUser } = useUserStore();

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@tukorea.ac.kr$/;
    return regex.test(email);
  };

  const moveToMainPage = () => {
    navigate('/');
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setErrorMessage('이메일 형식이 올바르지 않습니다 (@tukorea.ac.kr 도메인 사용)');
      return;
    }

    try {
      const response = await api.post("users/login/", {
        school_email: email,
        password: password,
      });

      setErrorMessage('');

      setUser(response.data);
      localStorage.setItem("refreshToken", response.data.refresh);
      localStorage.setItem("accessToken", response.data.access);
      moveToMainPage();
    } catch (error: any) {
      setErrorMessage("아이디 또는 비밀번호가 맞지 않습니다.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center px-10 pt-40 sm:pt-60">
      <h1 className="text-2xl font-bold mb-8">로그인</h1>
      <form onSubmit={handleLogin} className="w-full max-w-sm">
        {/* 이메일 입력 */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 pb-1 pl-1">학교 이메일</label>
          <input
            type="email"
            id="email"
            placeholder="학교 이메일을 입력해 주세요"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={`w-full p-3 border ${errorMessage && !validateEmail(email) ? 'border--[#ED7E7F]' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-[#617EF1]`}
          />
          {errorMessage && !validateEmail(email) && (
            <p className="text--[#ED7E7F] text-sm mt-2">{errorMessage}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-8">
          <label htmlFor="password" className="block text-gray-700 pb-1 pl-1">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#617EF1]"
          />
        </div>

        {/* 로그인 버튼 */}
        <button
          type="submit"
          className="w-full py-3 text-[#617EF1] bg-white hover:bg-[#617EF1] hover:text-white border border-[#617EF1] rounded-full font-bold transition duration-200"
          onClick={handleLogin}
        >
          로그인
        </button>
      </form>

      {errorMessage && validateEmail(email) && (
        <p className="text-[#ED7E7F] text-sm mt-4">{errorMessage}</p>
      )}

      {/* 회원가입 안내 */}
      <p className="mt-8 text-gray-600">
        회원이 아니신가요? <a href="/register" className="text-[#617EF1] hover:underline">회원가입</a>
      </p>
    </div>
  );
};

export default LoginPage;