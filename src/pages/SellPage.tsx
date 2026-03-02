import React, { useEffect, useState } from "react";
import { Upload } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../baseURL/baseURL";
import usePostsStore from "../stores/usePostsStore";
import heic2any from "heic2any";
import { majors } from "../constants/major";
import useBookStore from "../stores/useBookStore";

const SellPage = () => {
  const navigate = useNavigate();
  const { book_id } = useParams<{ book_id?: string }>();
  const { fetchBooks } = usePostsStore();
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [title, setTitle] = useState("");
  const [chatLink, setChatLink] = useState("");
  const [price, setPrice] = useState(0);
  const [major, setMajor] = useState("");
  const [status, setStatus] = useState("FOR_SALE");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const { currentBook, fetchBook } = useBookStore();

  const saleStatuses = [
    { value: "FOR_SALE", label: "판매 중" },
    { value: "IN_PROGRESS", label: "거래 중" },
    { value: "COMPLETED", label: "거래 완료" },
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
    if (!title || !chatLink || !price || !major || !description) {
      alert("모든 필드를 입력해 주세요.");
      return;
    }

    if (imageFiles.length === 0) {
      alert("최소 1개의 이미지를 업로드해야 합니다.");
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem("accessToken");
      const formData = new FormData();

      formData.append("title", title);
      formData.append("chatLink", chatLink);
      formData.append("price", String(price));
      formData.append("description", description);
      formData.append("major", major);
      formData.append("status", status);

      imageFiles.forEach((file) => {
        formData.append("images", file, file.name);
      });

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      if (book_id) {
        await api.patch(`books/${book_id}/`, formData, config);
        alert("서적 정보가 성공적으로 수정되었습니다.");
      } else {
        await api.post("books/", formData, config);
        alert("서적이 성공적으로 등록되었습니다.");
      }

      navigate("/");
      await fetchBooks();
    } catch (error) {
      console.error("서적 등록/수정 오류:", error);
      alert("서적 등록/수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 가격 유효성 검사
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;

    // 숫자와 소수점만 허용
    if (!/^\d*\.?\d{0,2}$/.test(value)) return;

    // 앞에 0이 붙으면 제거 (01 → 1)
    if (value.startsWith("0") && value.length > 1 && !value.includes(".") && value.length < 8) {
      value = value.replace(/^0+/, "");
    }

    setPrice(Number(value));
  };

  // 카카오톡 오픈채팅 유효성 검사
  const handleChatLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setChatLink(e.target.value);
  };

  const validateChatLink = () => {
    const regex = /^https:\/\/open\.kakao\.com\/o\/\S+$/;
    if (!regex.test(chatLink)) {
      alert("올바른 카카오톡 오픈채팅 링크를 입력해주세요.");
    }
  };

  useEffect(() => {
    if (!book_id) return;
    fetchBook(book_id);
  }, [book_id]);

  useEffect(() => {
    if (!currentBook) return;

    setTitle(currentBook.title);
    setChatLink(currentBook.chatLink);
    setPrice(currentBook.price);
    setMajor(currentBook.major);
    setStatus(currentBook.status);
    setDescription(currentBook.description);

    if (Array.isArray(currentBook.images)) {
      const urls = currentBook.images.map((img) => img.image_url);
      setUploadedImageUrls(urls);
    }
  }, [currentBook]);

  // 이미지 삭제 핸들러
  const handleResetImages = () => {
    setUploadedImageUrls([]);
    setImageFiles([]);
  };

  return (
    <div className="max-w-md mx-auto px-8 pb-8 space-y-4 pt-10">
      {/* 이미지 업로드 */}
      <div>
        <div className="flex justify-between">
          <label className="block text-[10px] sm:text-sm font-medium pl-1 pb-1">
            사진 (최소 1장, 최대 3장)
          </label>
          <button
            className="rounded-lg bg-alert text-white px-2 text-xs cursor-pointer"
            onClick={handleResetImages}
          >
            RESET
          </button>
        </div>
        <div className="flex gap-2">
          {uploadedImageUrls.map((src, index) => (
            <div key={index} className="relative">
              <img
                src={src}
                alt="preview"
                className="w-14 h-14 object-cover rounded-lg border border-gray-700 aspect-square"
              />
            </div>
          ))}
          {uploadedImageUrls.length < 3 && (
            <label className="w-14 h-14 flex flex-col items-center justify-center rounded-lg cursor-pointer bg-gray-100">
              <Upload className="w-5 h-5 text-gray-600" />
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
        <label className="block text-[10px] sm:text-sm font-medium pl-1 pb-1">책 제목</label>
        <input
          type="text"
          placeholder="책 제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={`w-full p-3 border rounded-lg text-sm placeholder:text-gray-700 ${
            title ? "border-primary" : "border-gray-700"
          }`}
        />
        {/* {error.title && <p className="text-alert text-[10px] sm:text-sm mt-1 pl-1">{error.title}</p>} */}
      </div>

      {/* 가격 입력 */}
      <div>
        <label className="block text-[10px] sm:text-sm font-medium pl-1 pb-1">가격</label>
        <input
          type="text"
          placeholder="가격을 입력하세요"
          value={price || ""}
          onChange={handlePriceChange}
          className={`w-full p-3 border rounded-lg text-sm placeholder:text-gray-700 ${
            price ? "border-primary" : "border-gray-700"
          }`}
        />
      </div>

      {/* 전공 선택 (Dropdown) */}
      <div className="mb-4">
        <label className="block text-gray-900 pb-1 pl-1 text-[10px] sm:text-sm">전공</label>
        <div className="relative">
          <select
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            className={`appearance-none w-full p-3 border rounded-lg pr-10 text-xs ${
              major ? "border-primary" : "border-gray-700"
            }`}
          >
            <option value="" className="text-gray-900 text-sm">
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
      </div>

      {/* 상태 선택 */}
      {book_id && (
        <div className="mb-4">
          <label className="block text-gray-900 pb-1 pl-1 text-[10px] sm:text-sm">판매 상태</label>
          <div className="relative">
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`appearance-none w-full p-3 border rounded-lg pr-10 text-xs ${
                status ? "border-primary" : "border-gray-700"
              }`}
            >
              {saleStatuses.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
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
        </div>
      )}

      <div>
        <label className="block text-[10px] sm:text-sm font-medium pl-1 pb-1">상태 설명</label>
        <textarea
          placeholder="책의 상태를 설명해 주세요"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`w-full h-48 p-3 border rounded-lg resize-none text-sm placeholder:text-gray-700 ${
            description ? "border-primary" : "border-gray-700"
          }`}
        />
        {/* {error.description && <p className="text-error text-[10px] sm:text-sm pl-1">{error.description}</p>} */}
      </div>

      {/* 카카오톡 오픈채팅 링크 입력 */}
      <div>
        <label className="block text-[10px] sm:text-sm font-medium pl-1 pb-1">
          카카오톡 오픈채팅 링크
        </label>
        <input
          type="text"
          placeholder="https://open.kakao.com/"
          value={chatLink}
          onChange={handleChatLinkChange}
          onBlur={validateChatLink}
          className={`w-full p-3 border rounded-lg text-sm placeholder:text-gray-700 ${
            chatLink ? "border-primary" : "border-gray-700"
          }`}
        />
      </div>

      {/* 등록 / 수정 버튼 */}
      <button
        className="w-full bg-primary text-white py-3 rounded-full text-sm"
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "처리 중..." : book_id ? "수정하기" : "등록하기"}
      </button>
    </div>
  );
};;

export default SellPage;
