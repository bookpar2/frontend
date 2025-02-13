import React, { useState } from 'react';

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const validateEmail = (email: string) => {
    const regex = /^[a-zA-Z0-9._%+-]+@tukorea.ac.kr$/;
    return regex.test(email);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateEmail(email)) {
      setErrorMessage('이메일 형식이 올바르지 않습니다 (@tukorea.ac.kr 도메인 사용)');
      return;
    }

    if (email !== 'commit@tukorea.ac.kr' || password !== 'password123') {
      setErrorMessage('아이디 또는 비밀번호가 일치하지 않습니다');
      return;
    }

    setErrorMessage('');
    alert('로그인 성공!');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-10">
      <h1 className="text-2xl font-bold mb-8">회원가입</h1>
      <form onSubmit={handleLogin} className="w-full max-w-sm">
        {/* 이름 입력 */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 pb-1 pl-1">이름</label>
          <input
            type="text"
            id="name"
            placeholder="이름을 입력해 주세요"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 학번 입력 */}
        <div className="mb-4">
          <label htmlFor="student_id" className="block text-gray-700 pb-1 pl-1">학번</label>
          <input
            type="text"
            id="student_id"
            placeholder="학번을 입력해 주세요"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 이메일 입력 */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 pb-1 pl-1">학교 이메일</label>
          <div className="flex">
            <input
              type="email"
              id="email"
              placeholder="학교 이메일을 입력해 주세요"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-3/4 p-3 border mr-2 ${errorMessage && !validateEmail(email) ? 'border-error' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            <button className="w-1/4 rounded-lg bg-primary text-white hover:bg-darker">인증하기</button>
          </div>
          {errorMessage && !validateEmail(email) && (
            <p className="text-error text-sm mt-2">{errorMessage}</p>
          )}
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 pb-1 pl-1">비밀번호</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-8">
          <label htmlFor="password" className="block text-gray-700 pb-1 pl-1">비밀번호 확인</label>
          <input
            type="password"
            id="password"
            placeholder="비밀번호를 입력해 주세요"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className="w-full py-3 text-white bg-primary hover:bg-darker border rounded-full font-bold transition duration-200"
        >
          회원가입
        </button>
      </form>

      {errorMessage && validateEmail(email) && (
        <p className="text-error text-sm mt-4">{errorMessage}</p>
      )}
    </div>
  );
};

export default RegisterPage;