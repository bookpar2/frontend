import React, { useEffect } from 'react';
import usePostsStore from '../stores/usePostsStore';
import PostCard from '../components/PostCard';

const MainPage: React.FC = () => {
  const { books, fetchBooks, loading, error } = usePostsStore();

  useEffect(() => {
    fetchBooks();
  }, [fetchBooks]);

  return (
    <div className="min-h-screen">
      {/* 배너 */}
      <section className="w-full bg-secondary pt-16">
        <div className="w-full max-w-screen-lg mx-auto">
          <img src="/images/home-banner.png" alt="banner" className="w-full select-none" />
        </div>
      </section>
      {/* 판매 서적 목록 */}
      <section className="w-full flex flex-col items-center py-8">
        <h2 className="text-xl font-bold text-gray-800 mb-7">판매 중인 중고서적</h2>
        {loading ? (
          <p className="text-gray-500 mt-2">로딩 중...</p>
        ) : error ? (
          <p className="text-red-500 mt-2">{error}</p>
        ) : books.length > 0 ? (
          <div className="px-3 my-0 mt-2 grid w-full max-w-[1024px] grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6 text-left justify-items-center">
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
  );
};

export default MainPage;