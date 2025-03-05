import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import api from "../baseURL/baseURL";
import usePostsStore from "../stores/usePostsStore";
import heic2any from "heic2any";

function SellPage() {
  const navigate = useNavigate();
  const location = useLocation();
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
  const [loading, setLoading] = useState(false);

  const majors = [
    "컴퓨터공학전공", "소프트웨어전공", "게임공학과", "인공지능학과",
    "SW자율전공", "자유전공학부", "전자공학전공", "임베디드시스템전공",
    "나노반도체공학전공", "반도체시스템전공", "기계공학과", "기계설계전공",
    "지능형모빌리티전공", "메카트로닉스전공", "AI로봇전공", "신소재공학과",
    "생명화학공학과", "전력응용시스템전공", "미래에너지시스템전공", "경영학전공",
    "IT경영전공", "데이터사이언스경영전공", "산업디자인공학전공", "미디어디자인공학전공",
    "지식융합학부"
  ];

  const saleStatuses = [
    { value: "FOR_SALE", label: "판매 중" },
    { value: "IN_PROGRESS", label: "거래 중" },
    { value: "COMPLETED", label: "거래 완료" }
  ];

  // 이미지 업로드 핸들러
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files) return;

    const newFilesArray = Array.from(event.target.files);
    const processedFiles = await Promise.all(
      newFilesArray.map(async (file) => {
        if (file.type === "image/heic" || file.name.toLowerCase().endsWith(".heic")) {
          try {
            const convertedBlob = await heic2any({ blob: file, toType: "image/jpeg" });
            return new File([convertedBlob as Blob], file.name.replace(/\.heic$/i, ".jpg"), {
              type: "image/jpeg",
            });
          } catch (e) {
            console.error("HEIC 파일 변환 오류:", e);
            alert("HEIC 파일 변환 중 오류가 발생했습니다.");
            return null;
          }
        }
        return file;
      })
    );

    const validFiles = processedFiles.filter((file): file is File => file !== null);
    if (validFiles.length === 0) return;

    // 새 파일을 URL로 변환
    const newFileUrls = validFiles.map((file) => URL.createObjectURL(file));

    setImageFiles((prev) => [...prev, ...validFiles].slice(0, 3));
    setUploadedImageUrls((prev) => [...prev, ...newFileUrls].slice(0, 3));
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

      // 새로 업로드된 이미지 추가
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      console.log("🚀 전송할 FormData:", [...formData.entries()]);

      if (book_id) {
        await api.patch(`books/${book_id}/`, formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("서적 정보가 성공적으로 수정되었습니다.");
        navigate("/");
      } else {
        await api.post("books/", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
        alert("서적이 성공적으로 등록되었습니다.");
        navigate("/");
      }

      await fetchBooks();
    } catch (error) {
      console.error("서적 등록/수정 오류:", error);
      alert("서적 등록/수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // book_id 변경 시 기존 데이터 불러오기 (수정 모드)
  useEffect(() => {
    if (!book_id) return;
    setLoading(true);

    const fetchBookData = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get(`books/${book_id}/`, {
          headers: { "Authorization": `Bearer ${token}` },
        });

        const bookData = response.data;

        setTitle(bookData.title);
        setChatLink(bookData.chatLink);
        setPrice(String(bookData.price));
        setMajor(bookData.major);
        setStatus(bookData.status);
        setDescription(bookData.description);

        if (Array.isArray(bookData.images)) {
          setUploadedImageUrls(bookData.images.map((img: any) => img.image_url));
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

  // 이미지 삭제 핸들러
  const handleRemoveImage = (index: number) => {
    if (index < uploadedImageUrls.length) {
      setUploadedImageUrls((prev) => prev.filter((_, i) => i !== index));
    } else {
      const newIndex = index - uploadedImageUrls.length;
      setImageFiles((prev) => prev.filter((_, i) => i !== newIndex));
    }
  };

  useEffect(() => {
    setImageFiles([]);
    setUploadedImageUrls([]);
    setTitle("");
    setChatLink("");
    setPrice("");
    setMajor("");
    setStatus("FOR_SALE");
    setDescription("");
    setLoading(false);
  }, [location])

  return (
    <div className="max-w-md mx-auto px-8 pb-8 space-y-4 pt-28 sm:pt-40">
      {/* 이미지 업로드 */}
      <div>
        <div className="flex justify-between items-center">
          <label className="block text-sm font-medium pl-1 pb-1">사진 (최대 3장)</label>
          {/* {allImages.length > 0 && (
            <button onClick={() => handleRemoveImage([]))} 
              className="mt-2 px-3 py-1 text-sm text-white bg-red-500 rounded-md">
              RESET
            </button>
          )} */}
        </div>
        <div className="flex gap-2">
          {uploadedImageUrls.map((src, index) => (
            <div key={index} className="relative">
              <img src={typeof src === "string" ? src : URL.createObjectURL(src)} alt="preview" 
                className="w-18 h-18 object-cover rounded-md border border-gray-200 aspect-square" />
              <button 
                className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center"
                onClick={() => handleRemoveImage(index)}
              >
                ×
              </button>
            </div>
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

      <div>
        <label className="block text-sm font-medium pl-1 pb-1">상태 설명</label>
        <textarea 
          placeholder="책의 상태를 설명해 주세요(중고 여부, 필기 여부 등)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full h-48 p-3 border rounded-md resize-none border-gray-300`}
        />
        {/* {error.description && <p className="text-error text-sm pl-1">{error.description}</p>} */}
      </div>

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