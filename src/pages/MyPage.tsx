import { useEffect, useState } from "react";
import api from "../baseURL/baseURL"; // API 요청을 위한 Axios 인스턴스
import PostCard from "../components/PostCard";
import { PostCardProps } from "../dataType";

function MyPage() {
  const [userInfo, setUserInfo] = useState({
    name: "",
    student_id: "",
    school_email: "",
  });

  const [books, setBooks] = useState<PostCardProps[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserBooks = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("accessToken");
        const response = await api.get("books/user/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // 사용자 정보 저장
        setUserInfo({
          name: response.data.sellers.name,
          student_id: response.data.sellers.student_id,
          school_email: response.data.sellers.school_email,
        });

        // 책 목록 저장 (API 응답 구조에 맞게 변환)
        const booksData: PostCardProps[] = response.data.books.map((book: any) => ({
          book_id: book.id,
          title: book.title,
          price: book.price,
          saleStatus: book.status,
          image_url: book.image_url || [], // null이 아닐 경우 배열로 변환
        }));

        setBooks(booksData);
      } catch (error) {
        console.error("내 서적 불러오기 오류:", error);
        setError("데이터를 불러오는 중 문제가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserBooks();
  }, []);

  return (
    <div className="max-w-md min-h-screen flex flex-col mx-auto items-center pt-20 sm:pt-18">
      {/* 사용자 정보 */}
      <div className="w-full px-4 pb-6 sm:pt-4 border-b">
        <section className="w-full border border-primary rounded-2xl max-w-md p-8 space-y-4">
          <article className="flex space-x-4">
            <div className="font-bold">이름</div>
            <div>{userInfo.name}</div>
          </article>
          <article className="flex space-x-4">
            <div className="font-bold">학번</div>
            <div>{userInfo.student_id}</div>
          </article>
          <article className="flex space-x-4">
            <div className="font-bold">이메일</div>
            <div>{userInfo.school_email}</div>
          </article>
        </section>  
      </div>

      {/* 사용자가 등록한 서적 목록 */}
      <section className="w-full flex flex-col items-center py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-7">내가 등록한 중고서적</h2>
        {loading ? (
          <p className="text-gray-500 mt-2">로딩 중...</p>
        ) : error ? (
          <p className="text-red-500 mt-2">{error}</p>
        ) : books.length > 0 ? (
          <div className="px-3 mt-2 grid w-full grid-cols-2 gap-3 lg:gap-6 text-left justify-items-center">
            {books.map((book) => (
              <PostCard
                key={book.book_id}
                book_id={book.book_id}
                title={book.title}
                price={book.price}
                saleStatus={book.saleStatus}
                image_url={book.image_url} // 기본 이미지 설정
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">등록한 중고서적이 없습니다</p>
        )}
      </section>
    </div>
  );
}

export default MyPage;