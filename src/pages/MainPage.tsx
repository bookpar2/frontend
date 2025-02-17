import React from 'react';
import PostCard from '../components/PostCard';

const MainPage: React.FC = () => {
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
        {/* <p className="text-gray-500 mt-2">판매 중인 중고서적이 없습니다</p> */}
        <div className="px-3 my-0 mt-2 flex w-full max-w-[1024px] flex-wrap gap-6 justify-start text-left md:w-[759px] 2xl:w-[1024px]">
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
          <PostCard />
        </div>
      </section>
    </div>
  );
};

export default MainPage;