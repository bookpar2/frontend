import React, { useState } from "react";
import { Upload } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../baseURL/baseURL"; // API 요청을 위한 Axios 인스턴스

function SellPage() {
  const navigate = useNavigate();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [chatLink, setChatLink] = useState("");
  const [price, setPrice] = useState("");
  const [major, setMajor] = useState("");
  const [status, setStatus] = useState("FOR_SALE");
  const [description, setDescription] = useState("");
  const [error, setError] = useState({
    image: "",
    title: "",
    price: "",
    description: "",
    major: "",
    chatLink: ""
  });
  const [loading, setLoading] = useState(false);

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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);
      console.log(files)
      const fileUrls = files.map((file) => URL.createObjectURL(file));
  
      setImageFiles([...imageFiles, ...files].slice(0, 3)); // 이미지 파일 저장
      setUploadedImageUrls([...uploadedImageUrls, ...fileUrls].slice(0, 3)); // 로컬 URL 저장
    }
  };  

  // 서적 등록 API 요청
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const token = localStorage.getItem("accessToken");
  
      await api.post(
        "books/",
        {
          title,
          chatLink,
          price: Number(price),
          description,
          major,
          image_url: "",
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
  
      alert("서적이 성공적으로 등록되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("서적 등록 오류:", error);
      alert("서적 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };  

  return (
    <div className="max-w-md mx-auto px-8 pb-8 space-y-4 pt-28 sm:pt-40">
      {/* 이미지 업로드 */}
      <div>
        <label className="block text-sm font-medium pl-1 pb-1">사진 (최소 1장)</label>
        <div className="flex gap-2">
          {uploadedImageUrls.map((src, index) => (
            <img key={index} src={src} alt="preview" className="w-18 h-18 object-cover rounded-md border border-gray-300 aspect-square" />
          ))}
          {uploadedImageUrls.length < 3 && (
            <label className="w-18 h-18 flex flex-col items-center justify-center border rounded-md cursor-pointer bg-gray-100">
              <Upload className="w-5 h-5 text-gray-500" />
              <p className="text-gray-400 text-xs">{uploadedImageUrls.length}/3</p>
              <input 
                type="file"
                multiple
                className="hidden"
                onChange={handleImageUpload}
                accept=".jpg, .jpeg, .png, .svg, image/*;capture=camera"
              />
            </label>
          )}
        </div>
        {/* {error.image && <p className="text-error text-sm mt-1 pl-1">{error.image}</p>} */}
      </div>

      {/* 책 제목 입력 */}
      <div>
        <label className="block text-sm font-medium pl-1 pb-1">책 제목</label>
        <input
          type="text"
          placeholder="책 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full p-3 border rounded-md ${error.title ? "border-error" : "border-gray-300"}`}
        />
        {error.title && <p className="text-error text-sm mt-1 pl-1">{error.title}</p>}
      </div>

      {/* 가격 입력 */}
      <div>
        <label className="block text-sm font-medium pl-1 pb-1">가격</label>
        <input
          type="number"
          placeholder="가격을 입력하세요"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={`w-full p-3 border rounded-md ${error.price ? "border-error" : "border-gray-300"}`}
        />
        {error.price && <p className="text-error text-sm mt-1 pl-1">{error.price}</p>}
      </div>

      {/* 전공 선택 (Dropdown) */}
      <div>
        <label className="block text-sm font-medium pl-1 pb-1">전공</label>
        <div className="relative">
          <select
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="appearance-none w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-white"
          >
            <option value="">전공을 선택하세요</option>
            {majors.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">⌄</div>
        </div>
        {error.major && <p className="text-error text-sm mt-1 pl-1">{error.major}</p>}
      </div>

      {/* 상태 선택 */}
      <div>
        <label className="block text-sm font-medium pl-1 pb-1">상태 설명</label>
        <textarea 
          placeholder="책의 상태를 설명해 주세요(중고 여부, 필기 여부 등)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full h-48 p-3 border rounded-md resize-none ${error.description ? "border-error" : "border-gray-300"}`}
        />
        {error.description && <p className="text-error text-sm pl-1">{error.description}</p>}
      </div>

      {/* 카카오톡 오픈채팅 링크 입력 */}
      <div>
        <label className="block text-sm font-medium pl-1 pb-1">카카오톡 오픈채팅 링크</label>
        <input
          type="text"
          placeholder="카카오톡 오픈채팅 링크를 입력하세요"
          value={chatLink}
          onChange={(e) => setChatLink(e.target.value)}
          className={`w-full p-3 border rounded-md ${error.chatLink ? "border-error" : "border-gray-300"}`}
        />
        {error.chatLink && <p className="text-error text-sm mt-1 pl-1">{error.chatLink}</p>}
      </div>

      {/* 등록 버튼 */}
      <button className="w-full bg-primary text-white py-3 rounded-full" onClick={handleSubmit} disabled={loading}>
        {loading ? "등록 중..." : "등록하기"}
      </button>
    </div>
  );
}

export default SellPage;