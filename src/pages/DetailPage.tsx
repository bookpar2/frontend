import { useNavigate, useParams } from "react-router-dom";
import usePostsStore from "../stores/usePostsStore"
import SalesStatus from "../components/SalesStatus";
import useUserStore from "../stores/useUserStore";
import api from "../baseURL/baseURL";

function DetailPage() {
  const navigate = useNavigate();
  const { book_id } = useParams<{ book_id: string }>();
  const { books, fetchBooks } = usePostsStore();
  const { id } = useUserStore();
  const book = books.find((b) => b.book_id === Number(book_id));

  if (!book) {
    return <p className="text-center text-gray-500">책 정보를 찾을 수 없습니다.</p>;
  }

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
      await fetchBooks(); // 삭제 후 목록 갱신
      navigate("/"); // 메인 페이지로 이동
    } catch (error) {
      console.error("서적 삭제 오류:", error);
      alert("서적 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="flex flex-col justify-between min-h-screen max-w-md mx-auto px-4 space-y-4 bg-white pt-24 pb-8">
      <div>
        <div className="aspect-square bg-blue-100 p-6 rounded-lg text-center">
          <img src={`${book.image_url}`} />
        </div>
        
        <div className="flex justify-between border-b py-3">
          <div className="flex space-x-1 items-center">
            <img src="/images/person.svg" alt="User" className="w-8 h-8 ml-2" />
            <span className="text-gray-800 font-medium">{book.seller_name}</span>
          </div>
          {book.seller === id && (
            <button
              className="mr-2 px-3 py-1 text-sm text-white bg-red-500 rounded-md"
              onClick={handleDelete}
            >
              삭제하기
            </button>
          )}
        </div>

        <div className="p-4 rounded-lg">
          <SalesStatus saleStatus={book.saleStatus} />
          <h3 className="text-lg font-semibold mt-2">{book.title}</h3>
          <p className="text-gray-500 text-lg mb-6">{book.price.toLocaleString()}원</p>
          <p className="text-sm text-gray-700 mt-2">{book.description}</p>
        </div>
      </div>
      
      {/* 본인이 등록한 책이라면 무조건 "수정하기" 버튼 표시 */}
      {book.seller === id ? (
        <button 
          className="w-full bg-white border border-primary text-primary py-3 rounded-full mt-3 hover:bg-primary hover:text-white"
          onClick={() => navigate(`/edit/${book.book_id}`)}
        >
          수정하기
        </button>
      ) : (
        // "판매자와 채팅하기" 버튼은 "판매 완료(COMPLETED)"가 아닐 때만 표시
        book.saleStatus !== "COMPLETED" && (
          <button 
            className="w-full bg-primary text-white py-3 rounded-full mt-3 hover:bg-darker"
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