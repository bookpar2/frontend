import { useEffect, useMemo, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import SalesStatus from "../components/SalesStatus";
import useUserStore from "../stores/useUserStore";
import api from "../baseURL/baseURL";
import { useSwipeable } from "react-swipeable";
import { Book } from "../dataType";

const DetailPage = () => {
  const navigate = useNavigate();
  const { book_id } = useParams<{ book_id: string }>();
  const { id } = useUserStore();

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [currentImageIndex, setCurrentImageIndex] = useState<number>(0);

  useEffect(() => {
    const fetchBookDetail = async () => {
      setLoading(true);
      try {
        const response = await api.get(`books/${book_id}/`);
        setBook(response.data);
        setCurrentImageIndex(0);
      } catch (error) {
        console.error("상세 조회 실패:", error);
        setBook(null);
      } finally {
        setLoading(false);
      }
    };

    if (book_id) fetchBookDetail();
  }, [book_id]);

  const images = useMemo(() => {
    const urls =
      book?.images && book.images.length > 0
        ? book.images.map((img: any) => img.image_url)
        : ["/images/default-book.png"];
    return urls.length > 0 ? urls : ["/images/default-book.png"];
  }, [book]);

  const prevImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  }, [images.length]);

  const nextImage = useCallback(() => {
    setCurrentImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  }, [images.length]);

  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
    trackMouse: true,
  });

  if (loading) {
    return <p className="text-center text-gray-500">불러오는 중...</p>;
  }

  if (!book) {
    return <p className="text-center text-gray-500">책 정보를 찾을 수 없습니다.</p>;
  }

  // 책 삭제 API
  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말 이 서적을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`books/${book_id}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("서적이 성공적으로 삭제되었습니다.");
      navigate("/");
    } catch (error) {
      console.error("서적 삭제 오류:", error);
      alert("서적 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="h-full flex flex-col justify-between max-w-md mx-auto px-4 space-y-4 bg-white py-8">
      <div>
        {/* 이미지 슬라이드 */}
        <div
          {...handlers}
          className="relative flex aspect-square bg-blue-100 p-6 rounded-lg text-center items-center overflow-hidden"
        >
          <img
            src={images[currentImageIndex]}
            className="w-full h-full object-contain rounded-lg"
            alt="Book"
          />

          {images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-md"
                onClick={prevImage}
              >
                ◀
              </button>
              <button
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-md"
                onClick={nextImage}
              >
                ▶
              </button>
            </>
          )}

          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* 판매자 정보 및 삭제 버튼 */}
        <div className="flex justify-between border-b border-gray-300 py-3">
          <div className="flex space-x-1 items-center">
            <img src="/images/person.svg" alt="User" className="w-8 h-8 ml-2" />
            <span className="text-gray-900 font-medium">{book.seller_name}</span>
          </div>

          {book.seller === id && (
            <button
              className="mr-2 px-3 py-1 text-sm text-white bg-alert rounded-md"
              onClick={handleDelete}
            >
              삭제하기
            </button>
          )}
        </div>

        {/* 서적 정보 */}
        <div className="p-4 rounded-lg">
          <SalesStatus saleStatus={book.status} />
          <h3 className="text-lg font-semibold mt-2">{book.title}</h3>
          <p className="text-gray-700 text-lg mb-6">{book.price.toLocaleString()}원</p>
          <p className="min-h-40 text-sm text-gray-900 mt-2">{book.description}</p>
        </div>
      </div>

      {/* 버튼 */}
      {book.seller === id ? (
        <button
          className="w-full bg-white border border-primary text-primary py-3 rounded-full mt-3"
          onClick={() => navigate(`/edit/${book_id}`)}
        >
          수정하기
        </button>
      ) : (
        book.status !== "COMPLETED" && (
          <button
            className="w-full bg-primary text-white py-3 rounded-full"
            onClick={() => window.open(book.chatLink, "_blank")}
          >
            판매자와 채팅하기
          </button>
        )
      )}
    </div>
  );
};

export default DetailPage;
