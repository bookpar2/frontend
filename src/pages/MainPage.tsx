import React from 'react';
import PostCard from '../components/PostCard';

const MainPage: React.FC = () => {
  // mock data
  const books = [
    { id: 1, title: "쉽게 배우는 파이썬", price: "2,000원", salesStatus: true },
    { id: 2, title: "자바의 정석", price: "5,000원", salesStatus: false },
    { id: 3, title: "운영체제", price: "7,000원", salesStatus: true },
    { id: 4, title: "데이터베이스 개론", price: "6,000원", salesStatus: true },
    { id: 5, title: "알고리즘 문제 해결 전략", price: "8,000원", salesStatus: false },
    { id: 6, title: "머신러닝 기초", price: "10,000원", salesStatus: true },
    { id: 7, title: "컴퓨터 네트워크", price: "9,000원", salesStatus: true }
  ];

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
        {books.length < 0 ? (
          <p className="text-gray-500 mt-2">판매 중인 중고서적이 없습니다</p>
        ) : (
          <div className="px-3 my-0 mt-2 grid w-full max-w-[1024px] grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 lg:gap-6 text-left justify-items-center">
            {books.map((book) => (
              <PostCard key={book.id} title={book.title} price={book.price} salesStatus={book.salesStatus} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MainPage;