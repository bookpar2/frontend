import React from 'react';

const MainPage: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* 배너 */}
      <section className="w-full bg-secondary pt-16">
        <div className="w-full max-w-screen-lg mx-auto">
          <img src="/images/home-banner.png" alt="banner" className="w-full" />
        </div>
      </section>
      {/* 판매 서적 목록 */}
      <section className="w-full flex flex-col items-center py-8">
        <h2 className="text-xl font-bold text-gray-800">판매 중인 중고서적</h2>
        <p className="text-gray-500 mt-2">판매 중인 중고서적이 없습니다</p>
      </section>
    </div>
  );
};

export default MainPage;