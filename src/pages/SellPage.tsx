import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../baseURL/baseURL";
import usePostsStore from "../stores/usePostsStore";
import heic2any from "heic2any";

function SellPage() {
  const navigate = useNavigate();
  const { book_id } = useParams<{ book_id?: string }>();
  const { fetchBooks } = usePostsStore();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [chatLink, setChatLink] = useState("");
  const [price, setPrice] = useState("");
  const [major, setMajor] = useState("");
  const [status, setStatus] = useState("FOR_SALE");
  const [description, setDescription] = useState("");
  // const [error, setError] = useState({
  //   image: "",
  //   title: "",
  //   price: "",
  //   description: "",
  //   major: "",
  //   chatLink: ""
  // });
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

  const saleStatuses = [
    { value: "FOR_SALE", label: "판매 중" },
    { value: "IN_PROGRESS", label: "거래 중" },
    { value: "COMPLETED", label: "거래 완료" }
  ];

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;
  
    const newFilesArray = Array.from(event.target.files);
    console.log("📸 업로드된 원본 파일들:", newFilesArray);
  
    // HEIC 파일을 JPEG로 변환
    const convertedFilesArray = await Promise.all(
      newFilesArray.map(async (file) => {
        if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
          try {
            console.log(`🛠 HEIC 변환 중: ${file.name}`);
            const convertedBlob = await heic2any({
              blob: file,
              toType: "image/jpeg",
            });
  
            const convertedFile = new File(
              [convertedBlob as Blob],
              file.name.replace(/\.heic$/i, ".jpg"),
              { type: "image/jpeg" }
            );
  
            console.log(`HEIC 변환 완료: ${convertedFile.name}`);
            return convertedFile;
          } catch (e) {
            console.error("HEIC 파일 변환 오류:", e);
            alert("HEIC 파일 변환 중 오류가 발생했습니다.");
            return null;
          }
        } else {
          return file;
        }
      })
    );
  
    // 유효한 파일만 필터링
    const validFiles = convertedFilesArray.filter((file): file is File => file !== null);
  
    if (validFiles.length === 0) return;
  
    // 로컬 미리보기용 URL 생성 (새로 추가한 파일만 미리보기)
    const fileUrls = validFiles.map((file) => URL.createObjectURL(file));
  
    console.log("📂 변환된 및 유지된 파일들:", validFiles);
    console.log("🖼 생성된 미리보기 URL들:", fileUrls);
  
    // 기존 S3 URL 유지, 새 파일만 추가
    setImageFiles((prev) => [...prev, ...validFiles].slice(0, 3));
    setUploadedImageUrls((prev) => [...prev, ...fileUrls].slice(0, 3)); // UI 미리보기를 위해 URL 추가
  };  

  // 서적 등록 API 요청
  const handleSubmit = async () => {
    if (uploadedImageUrls.length === 0 && imageFiles.length === 0) {
      alert("최소 1개의 이미지를 업로드해야 합니다.");
      return;
    }
  
    setLoading(true);
  
    try {
      const token = localStorage.getItem("accessToken");
  
      const formData = new FormData();
      formData.append("title", title);
      formData.append("chatLink", chatLink);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("major", major);
      formData.append("status", status);
  
      // 기존의 S3 URL을 배열로 전송
      uploadedImageUrls.forEach((url) => {
        formData.append("image_url[]", url);
      });
  
      // 새로 업로드한 파일을 배열로 전송
      imageFiles.forEach((file) => {
        formData.append("image_url[]", file);
      });
  
      if (book_id) {
        await api.patch(`books/${book_id}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("서적 정보가 성공적으로 수정되었습니다.");
        navigate(0); // 🔥 수정 후 페이지 새로고침하여 초기화
      } else {
        await api.post("books/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("서적이 성공적으로 등록되었습니다.");
        navigate('/'); // 등록 후 페이지 새로고침하여 초기화
      }
  
      await fetchBooks();
    } catch (error) {
      console.error("서적 등록/수정 오류:", error);
      alert("서적 등록/수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };  

  // 수정 모드일 경우 기존 데이터 불러옴
  useEffect(() => {
    // book_id가 변경되면 모든 입력값 초기화
    setTitle("");
    setChatLink("");
    setPrice("");
    setMajor("");
    setStatus("FOR_SALE");
    setDescription("");
    setImageFiles([]);
    setUploadedImageUrls([]);
  
    if (!book_id) return; 
    setLoading(true);
  
    const fetchBookData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`books/${book_id}/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        const bookData = response.data;
        console.log("📸 서버에서 받아온 이미지 URL:", bookData.image_url);
  
        setTitle(bookData.title);
        setChatLink(bookData.chatLink);
        setPrice(String(bookData.price));
        setMajor(bookData.major);
        setStatus(bookData.status);
        setDescription(bookData.description);
  
        // 기존 S3 URL 유지
        if (Array.isArray(bookData.image_url)) {
          setUploadedImageUrls(bookData.image_url);
        } else if (typeof bookData.image_url === "string") {
          setUploadedImageUrls([bookData.image_url]);
        } else {
          setUploadedImageUrls([]);
        }
  
      } catch (error) {
        console.error("서적 정보 불러오기 오류:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchBookData();
  }, [book_id]);    

  return (
    <div className="max-w-md mx-auto px-8 pb-8 space-y-4 pt-28 sm:pt-40">
      {/* 이미지 업로드 */}
      <div>
        <div className="flex justify-between">
          <label className="block text-sm font-medium pl-1 pb-1">사진 (최소 1장)</label>
          {/* RESET 버튼 추가 */}
          {uploadedImageUrls.length > 0 && (
            <button 
              onClick={() => {
                setImageFiles([]);
                setUploadedImageUrls([]);
              }} 
              className="mt-2 px-3 py-1 text-sm text-white bg-red-500 rounded-md"
            >
              RESET
            </button>
          )}
        </div>
        <div className="flex gap-2">
        {Array.isArray(uploadedImageUrls) &&
          uploadedImageUrls.map((src, index) => (
            <img
              key={index}
              src={src}
              alt="preview"
              className="w-18 h-18 object-cover rounded-md border border-gray-200 aspect-square"
            />
          ))}

        {Array.isArray(uploadedImageUrls) && uploadedImageUrls.length < 3 && (
          <label className="w-18 h-18 flex flex-col items-center justify-center border border-gray-300 rounded-md cursor-pointer bg-gray-100">
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
        {/* {error.image && <p className="text-[#ED7E7F] text-sm mt-1 pl-1">{error.image}</p>} */}
      </div>

      {/* 책 제목 입력 */}
      <div>
        <label className="block text-sm font-medium pl-1 pb-1">책 제목</label>
        <input
          type="text"
          placeholder="책 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full p-3 border rounded-md border-gray-300`}
        />
        {/* {error.title && <p className="text-[#ED7E7F] text-sm mt-1 pl-1">{error.title}</p>} */}
      </div>

      {/* 가격 입력 */}
      <div>
        <label className="block text-sm font-medium pl-1 pb-1">가격</label>
        <input
          type="number"
          placeholder="가격을 입력하세요"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className={`w-full p-3 border rounded-md border-gray-300`}
        />
        {/* {error.price && <p className="text-[#ED7E7F] text-sm mt-1 pl-1">{error.price}</p>} */}
      </div>

      {/* 전공 선택 (Dropdown) */}
      <div className="mb-4">
        <label className="block text-gray-700 pb-1 pl-1">전공</label>
        <div className="relative">
          <select
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className="appearance-none w-full p-3 border border-gray-300 rounded-lg pr-10"
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
      </div>

      {/* 상태 선택 */}
      {book_id && (
        <div className="mb-4">
          <label className="block text-gray-700 pb-1 pl-1">판매 상태</label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="appearance-none w-full p-3 border rounded-lg pr-10"
            >
              {saleStatuses.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            {/* 화살표 아이콘 */}
            <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
      )}

      {/* 카카오톡 오픈채팅 링크 입력 */}
      <div>
        <label className="block text-sm font-medium pl-1 pb-1">카카오톡 오픈채팅 링크</label>
        <input
          type="text"
          placeholder="카카오톡 오픈채팅 링크를 입력하세요"
          value={chatLink}
          onChange={(e) => setChatLink(e.target.value)}
          className={`w-full p-3 border rounded-md border-gray-300`}
        />
        {/* {error.chatLink && <p className="text-[#ED7E7F] text-sm mt-1 pl-1">{error.chatLink}</p>} */}
      </div>

      {/* 등록 / 수정 버튼 */}
      <button className="w-full bg-[#617EF1] text-white py-3 rounded-full" onClick={handleSubmit} disabled={loading}>
        {loading ? "처리 중..." : book_id ? "수정하기" : "등록하기"}
      </button>
    </div>
  );
}

export default SellPage;