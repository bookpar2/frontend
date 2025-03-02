import { useEffect } from "react";
import usePostsStore from "../stores/usePostsStore";
import useUserStore from "../stores/useUserStore";
import PostCard from "../components/PostCard";

function MyPage() {
  const { school_email, name, student_id } = useUserStore();
  const { books, fetchBooks, loading, error } = usePostsStore();

  useEffect(() => {
      fetchBooks();
    }, [fetchBooks]);

  return (
    <div className="max-w-md min-h-screen flex flex-col mx-auto items-center pt-20 sm:pt-18">
      {/* 사용자 정보 */}
      <div className="w-full px-4 pb-6 sm:pt-4 border-b">
        <section className="w-full border border-primary rounded-2xl max-w-md p-8 space-y-4">
          <article className="flex space-x-4">
            <div className="font-bold">이름</div>
            <div>{ name }</div>
          </article>
          <article className="flex space-x-4">
            <div className="font-bold">학번</div>
            <div>{ student_id }</div>
          </article>
          <article className="flex space-x-4">
            <div className="font-bold">이메일</div>
            <div>{ school_email }</div>
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
                imageUrls={book.imageUrls}
              />
            ))}
          </div>
        ) : (
          <p className="text-gray-500 mt-2">판매 중인 중고서적이 없습니다</p>
        )}
      </section>
    </div>
  )
}

export default MyPage;