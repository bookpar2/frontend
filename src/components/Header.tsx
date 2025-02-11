import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="w-full bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center relative">
      <Link to="/" className="text-xl font-bold text-purple-600">
        <img src="/images/logo.svg" alt="Logo" className="h-10" />
      </Link>
      <div className="flex space-x-4 items-center">
        {/* 검색 아이콘 */}
        <Link to="/">
          <img src="/images/search.svg" alt="Search" className="w-6 h-6" />
        </Link>

        {/* 메뉴 아이콘 */}
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <img src="/images/menu.svg" alt="Menu" className="w-6 h-6" />
        </button>
      </div>

      {/* 메뉴 */}
      {menuOpen && (
        <div className="absolute top-16 right-6 w-48 bg-white shadow-lg border rounded-lg z-10">
          <ul className="flex flex-col">
            <li>
              <Link
                to="/"
                className={`block px-4 py-2 ${
                  isActive('/') ? 'text-blue-600' : 'text-gray-700'
                } hover:bg-gray-100`}
                onClick={() => setMenuOpen(false)}
              >
                구매하기
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className={`block px-4 py-2 ${
                  isActive('/login') ? 'text-blue-600 font-bold' : 'text-gray-700'
                } hover:bg-gray-100`}
                onClick={() => setMenuOpen(false)}
              >
                로그인
              </Link>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
};

export default Header;