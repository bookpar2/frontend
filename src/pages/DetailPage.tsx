import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import usePostsStore from "../stores/usePostsStore";
import SalesStatus from "../components/SalesStatus";
import useUserStore from "../stores/useUserStore";
import api from "../baseURL/baseURL";
import { useSwipeable } from "react-swipeable"; // 이미지 슬라이드를 위한 라이브러리

function DetailPage() {
  const navigate = useNavigate();
  const { book_id } = useParams<{ book_id: string }>();
  const { books, fetchBooks } = usePostsStore();
  const { id } = useUserStore();
  const book = books.find((b) => b.book_id === Number(book_id));

  // 이미지 슬라이드 상태 관리
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  if (!book) {
    return <p className="text-center text-gray-500">책 정보를 찾을 수 없습니다.</p>;
  }

  const images = book.images.length > 0 ? book.images : ["/images/default-book.png"];

  // 이전 이미지
  const prevImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === 0 ? images.length - 1 : prevIndex - 1));
  };

  // 다음 이미지
  const nextImage = () => {
    setCurrentImageIndex((prevIndex) => (prevIndex === images.length - 1 ? 0 : prevIndex + 1));
  };

  // 스와이프 감지 이벤트 핸들러
  const handlers = useSwipeable({
    onSwipedLeft: nextImage,
    onSwipedRight: prevImage,
  });

  // 서적 삭제 API 호출
  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말 이 서적을 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("accessToken");
      await api.delete(`books/${book_id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      alert("서적이 성공적으로 삭제되었습니다.");
      navigate("/"); // 메인 페이지로 이동
      await fetchBooks(); // 삭제 후 목록 갱신
    } catch (error) {
      console.error("서적 삭제 오류:", error);
      alert("서적 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen max-w-md mx-auto px-4 space-y-4 bg-white pt-24 pb-8">
      <div>
        {/* 이미지 슬라이드 */}
        <div {...handlers} className="relative flex aspect-square bg-blue-100 p-6 rounded-lg text-center items-center overflow-hidden">
          <img src={images[currentImageIndex]} className="w-full h-full object-cover rounded-lg" alt="Book Image" />
          {/* 좌우 화살표 버튼 */}
          {images.length > 1 && (
            <>
              <button
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-md"
                onClick={prevImage}
              >
                ◀
              </button>
              <button
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded-md"
                onClick={nextImage}
              >
                ▶
              </button>
            </>
          )}
          {/* 이미지 인덱스 표시 */}
          <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-sm px-3 py-1 rounded-md">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* 판매자 정보 및 삭제 버튼 */}
        <div className="flex justify-between border-b border-gray-300 py-3">
          <div className="flex space-x-1 items-center">
            <img src="/images/person.svg" alt="User" className="w-8 h-8 ml-2" />
            <span className="text-gray-800 font-medium">{book.seller_name}</span>
          </div>
          {book.seller === id && (
            <button
              className="mr-2 px-3 py-1 text-sm text-white bg-red-500 rounded-md cursor-pointer"
              onClick={handleDelete}
            >
              삭제하기
            </button>
          )}
        </div>

        {/* 서적 정보 */}
        <div className="p-4 rounded-lg">
          <SalesStatus saleStatus={book.saleStatus} />
          <h3 className="text-lg font-semibold mt-2">{book.title}</h3>
          <p className="text-gray-500 text-lg mb-6">{book.price.toLocaleString()}원</p>
          <p className="text-sm text-gray-700 mt-2">{book.description}</p>
        </div>
      </div>

      {/* 수정하기 / 판매자와 채팅하기 버튼 */}
      {book.seller === id ? (
        <button
          className="w-full bg-white border border-[#617EF1] text-[#617EF1] py-3 rounded-full mt-3 hover:bg-[#617EF1] hover:text-white cursor-pointer"
          onClick={() => navigate(`/edit/${book.book_id}`)}
        >
          수정하기
        </button>
      ) : (
        book.saleStatus !== "COMPLETED" && (
          <button
            className="w-full bg-[#617EF1] text-white py-3 rounded-full mt-3 hover:bg-[#4B63C1]"
            onClick={() => window.open(book.chatLink, "_blank")}
          >
            판매자와 채팅하기
          </button>
        )
      )}
    </div>
  );
}

export default DetailPage;