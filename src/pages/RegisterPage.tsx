import React, { useState } from 'react';

const RegisterPage: React.FC = () => {
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({
    name: '',
    studentId: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const validateEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@tukorea.ac.kr$/.test(email);

  const handleEmailVerification = () => {
    const tempErrors = { ...errors };
    if (!validateEmail(email)) {
      tempErrors.email = '이메일 형식이 올바르지 않습니다 (@tukorea.ac.kr 도메인 사용)';
    } else {
      tempErrors.email = ''; // 이메일이 올바르면 오류 메시지 제거
      alert('이메일 인증이 완료되었습니다.');
    }
    setErrors(tempErrors);
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    let tempErrors = {
      name: '',
      studentId: '',
      email: '',
      password: '',
      confirmPassword: '',
    };

    if (!/^[가-힣\s]+$/.test(name)) tempErrors.name = '이름은 한글로 입력해 주세요.';
    if (!/^[0-9]{10}$/.test(studentId)) tempErrors.studentId = '학번은 10자리 숫자 형식으로 입력해 주세요.';
    if (!validateEmail(email)) tempErrors.email = '이메일 형식이 올바르지 않습니다 (@tukorea.ac.kr 도메인 사용)';
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(password))
      tempErrors.password = '비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해 8자리 이상이어야 합니다.';
    if (password !== confirmPassword) tempErrors.confirmPassword = '비밀번호가 일치하지 않습니다.';

    setErrors(tempErrors);

    if (Object.values(tempErrors).every((error) => error === '')) {
      alert('회원가입 성공!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50 px-10">
      <h1 className="text-2xl font-bold mb-8">회원가입</h1>
      <form onSubmit={handleRegister} className="w-full max-w-xs">
        {/* 이름 입력 */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 pb-1 pl-1">이름</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해 주세요"
            className={`w-full p-3 border ${errors.name ? 'border-error' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.name && <p className="text-error text-xs mt-2">{errors.name}</p>}
        </div>

        {/* 학번 입력 */}
        <div className="mb-4">
          <label htmlFor="student_id" className="block text-gray-700 pb-1 pl-1">학번</label>
          <input
            type="text"
            id="student_id"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            placeholder="학번을 입력해 주세요"
            className={`w-full p-3 border ${errors.studentId ? 'border-error' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.studentId && <p className="text-error text-xs mt-2">{errors.studentId}</p>}
        </div>

        {/* 이메일 입력 */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 pb-1 pl-1">학교 이메일</label>
          <div className="flex">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="학교 이메일을 입력해 주세요"
              className={`w-3/4 p-3 border mr-2 ${errors.email ? 'border-error' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            <button
              type="button"
              onClick={handleEmailVerification}
              className="w-1/4 text-white bg-primary hover:bg-darker rounded-lg text-sm"
            >
              인증하기
            </button>
          </div>
          {errors.email && <p className="text-error text-xs mt-2">{errors.email}</p>}
        </div>

        {/* 비밀번호 입력 */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 pb-1 pl-1">비밀번호</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력해 주세요"
            className={`w-full p-3 border ${errors.password ? 'border-error' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.password && <p className="text-error text-xs mt-2">{errors.password}</p>}
        </div>

        {/* 비밀번호 확인 */}
        <div className="mb-8">
          <label htmlFor="confirm_password" className="block text-gray-700 pb-1 pl-1">비밀번호 확인</label>
          <input
            type="password"
            id="confirm_password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="비밀번호를 다시 입력해 주세요"
            className={`w-full p-3 border ${errors.confirmPassword ? 'border-error' : 'border-gray-300'} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.confirmPassword && <p className="text-error text-xs mt-2">{errors.confirmPassword}</p>}
        </div>

        {/* 회원가입 버튼 */}
        <button
          type="submit"
          className="w-full py-3 text-white bg-primary hover:bg-darker border rounded-full font-bold transition duration-200"
        >
          회원가입
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;