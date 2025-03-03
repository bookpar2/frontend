import React, { useState } from "react";
import api from "../baseURL/baseURL"; // Axios 인스턴스 가져오기
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [major, setMajor] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isCheckingCode, setIsCheckingCode] = useState(false);
  const [errors, setErrors] = useState({
    name: "",
    studentId: "",
    major: "",
    email: "",
    password: "",
    confirmPassword: "",
    verificationCode: "",
  });

  const majors = [
    "컴퓨터공학전공",
    "소프트웨어전공",
    "게임공학과",
    "인공지능학과",
    "SW자율전공",
    "자유전공학부",
    "전자공학전공",
    "임베디드시스템전공",
    "나노반도체공학전공",
    "반도체시스템전공",
    "기계공학과",
    "기계설계전공",
    "지능형모빌리티전공",
    "메카트로닉스전공",
    "AI로봇전공",
    "신소재공학과",
    "생명화학공학과",
    "전력응용시스템전공",
    "미래에너지시스템전공",
    "경영학전공",
    "IT경영전공",
    "데이터사이언스경영전공",
    "산업디자인공학전공",
    "미디어디자인공학전공",
    "지식융합학부"
  ];

  const validateEmail = (email: string) => /^[a-zA-Z0-9._%+-]+@tukorea.ac.kr$/.test(email);

  // 이메일 인증 요청 (API 호출)
  const handleEmailVerification = async () => {
    const tempErrors = { ...errors };

    if (!validateEmail(email)) {
      tempErrors.email = "이메일 형식이 올바르지 않습니다 (@tukorea.ac.kr 도메인 사용)";
      setErrors(tempErrors);
      return;
    }

    setIsVerifying(true); // 인증 요청 중 상태 변경

    try {
      const response = await api.post("users/send-verification-email/", {
        school_email: email,
        verification_type: "registration",
      });

      alert(response.data.message); // "인증 이메일이 발송되었습니다."
      tempErrors.email = ""; // 오류 제거
    } catch (error: any) {
      console.error("이메일 인증 오류:", error.response?.data);
      tempErrors.email = error.response?.data?.message || "이메일 인증 요청 중 오류가 발생했습니다.";
    } finally {
      setIsVerifying(false); // 요청 완료 후 버튼 활성화
      setErrors(tempErrors);
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    let tempErrors = {
      name: "",
      studentId: "",
      major: "",
      email: "",
      password: "",
      confirmPassword: "",
      verificationCode: "",
    };

    if (!/^[가-힣\s]+$/.test(name)) tempErrors.name = "이름은 한글로 입력해 주세요.";
    if (!/^[0-9]{10}$/.test(studentId)) tempErrors.studentId = "학번은 10자리 숫자 형식으로 입력해 주세요.";
    if (!majors.includes(major)) tempErrors.major = "전공을 선택해 주세요.";
    if (!validateEmail(email)) tempErrors.email = "이메일 형식이 올바르지 않습니다 (@tukorea.ac.kr 도메인 사용)";
    if (!/^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$/.test(password))
      tempErrors.password = "비밀번호는 영문 대소문자, 숫자, 특수문자를 포함해 8자리 이상이어야 합니다.";
    if (password !== confirmPassword) tempErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";
    if (!isCheckingCode) tempErrors.verificationCode = "인증코드가 일치하지 않습니다. 다시 시도해 주세요.";
  

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

    setIsCheckingCode(true); // 인증 코드 확인 중 상태 변경

    try {
      const response = await api.post("users/verify-email-code/", {
        school_email: email, // 기존 이메일 입력값 사용
        verification_code: verificationCode,
      });

      alert(response.data.message); // "인증 코드가 확인되었습니다."
      setIsCheckingCode(true); // 인증 성공
      setErrors({ ...tempErrors, verificationCode: "" }); // 오류 초기화
    } catch (error: any) {
      console.error("인증 코드 확인 오류:", error.response?.data);
      tempErrors.verificationCode = "인증에 실패했습니다. 다시 입력해 주세요.";
    } finally {
      setIsCheckingCode(false); // 요청 완료 후 버튼 활성화
      setErrors(tempErrors);
    }
  };

  // 회원가입 API
  const handleRegisterUser = async () => {
    // 유효성 검사
    const tempErrors = { ...errors };

    if (!name) tempErrors.name = "이름을 입력해 주세요.";
    if (!studentId) tempErrors.studentId = "학번을 입력해 주세요.";
    if (!major) tempErrors.major = "전공을 입력해 주세요.";
    if (!validateEmail(email)) tempErrors.email = "학교 이메일 형식이 올바르지 않습니다.";
    if (!verificationCode) tempErrors.verificationCode = "이메일 인증 코드를 입력해 주세요.";
    if (!password) tempErrors.password = "비밀번호를 입력해 주세요.";
    if (password !== confirmPassword) tempErrors.confirmPassword = "비밀번호가 일치하지 않습니다.";

    setErrors(tempErrors);

    // 오류가 없으면 회원가입 요청
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
        navigate("/login"); // 로그인 페이지로 이동
      } catch (error: any) {
        console.error("회원가입 오류:", error.response?.data);
        setErrors({ ...errors, email: error.response?.data?.message || "회원가입 중 오류가 발생했습니다." });
      }
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center px-10 pt-40 sm:pt-40">
      <h1 className="text-2xl font-bold mb-8">회원가입</h1>
      <form onSubmit={handleRegister} className="w-full max-w-sm">
        {/* 이름 입력 */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 pb-1 pl-1">이름</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="이름을 입력해 주세요"
            className={`w-full p-3 border ${errors.name ? "border-error" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
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
            className={`w-full p-3 border ${errors.studentId ? "border-error" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
          />
          {errors.studentId && <p className="text-error text-xs mt-2">{errors.studentId}</p>}
        </div>

        {/* 전공 선택 Dropdown */}
        <div className="mb-4">
          <label className="block text-gray-700 pb-1 pl-1">전공</label>
          <div className="relative">
            <select
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              className={`appearance-none w-full p-3 border ${errors.major ? "border-error" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary bg-white pr-10`}
            >
              <option value="">전공을 선택하세요</option>
              {majors.map((m) => (
                <option key={m} value={m}>
                  {m}
                </option>
              ))}
            </select>
            {/* 화살표 아이콘 */}
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          {errors.major && <p className="text-error text-xs mt-2">{errors.major}</p>}
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
              className={`w-3/4 p-3 border mr-2 ${errors.email ? "border-error" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            <button
              type="button"
              onClick={handleEmailVerification}
              className={`w-1/4 text-white bg-primary hover:bg-darker rounded-lg text-sm ${isVerifying ? "cursor-none" : "cursor-pointer"}`}
              disabled={isVerifying} // 요청 중일 때 버튼 비활성화
            >
              {isVerifying ? "전송 중..." : "인증"}
            </button>
          </div>
          {errors.email && <p className="text-error text-xs mt-2">{errors.email}</p>}
        </div>

        {/* 인증코드 입력란 */}
        <div className="mb-4">
          <label htmlFor="verificationCode" className="block text-gray-700 pb-1 pl-1">인증코드 입력</label>
          <div className="flex">
            <input
              type="input"
              id="verificationCode"
              value={verificationCode}
              onChange={(e) => setVerificationCode(e.target.value)}
              placeholder="인증코드를 입력해 주세요"
              className={`w-3/4 p-3 border mr-2 ${errors.verificationCode == "유효하지 않은 인증 코드입니다." ? "border-error" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
            />
            <button
              type="button"
              onClick={handleVerifyCode}
              className={`w-1/4 text-white bg-primary hover:bg-darker rounded-lg text-sm ${isCheckingCode ? "cursor-none" : "cursor-pointer"}`}
              disabled={isCheckingCode} // 요청 중일 때 버튼 비활성화
            >
              {isCheckingCode ? "전송 중..." : "확인"}
            </button>
          </div>
          {errors.verificationCode == "유효하지 않은 인증 코드입니다." ? <p className="text-error text-xs mt-2">{errors.verificationCode}</p> : ""}
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
            className={`w-full p-3 border ${errors.password ? "border-error" : "border-gray-300"} rounded-lg focus:outline-none focus:ring-2 focus:ring-primary`}
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
          className="w-full py-3 mb-12 text-white bg-primary hover:bg-darker border rounded-full font-bold transition duration-200"
          onClick={handleRegisterUser}
        >
          회원가입
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;