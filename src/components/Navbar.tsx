import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 z-[60] w-full bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <Link to="/">
        <img src="/images/logo.svg" alt="Logo" className="h-8 pl-1 select-none" />
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex">
        <Link to="/sell" className={`px-4 py-2 ${isActive('/sell') ? 'text-primary font-bold' : 'text-gray-700'} hover:bg-gray-100 rounded-lg`}>
          판매하기
        </Link>
        <Link to="/login" className={`px-4 py-2 ${isActive('/login') ? 'text-primary font-bold' : 'text-gray-700'} hover:bg-gray-100 rounded-lg`}>
          로그인
        </Link>
      </nav>
      
      {/* Mobile Menu */}
      <div className="md:hidden flex space-x-2 items-center">
        {/* 검색 아이콘 */}
        <Link to="/">
          <img src="/images/search.svg" alt="Search" className="w-6 h-6" />
        </Link>

        {/* 메뉴 아이콘 */}
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <img src="/images/menu.svg" alt="Menu" className="w-6 h-6" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-16 right-6 w-48 bg-white shadow-lg border rounded-lg z-10 md:hidden">
          <ul className="flex flex-col">
            <li>
              <Link
                to="/"
                className={`block px-4 py-2 ${
                  isActive('/') ? 'text-primary font-bold' : 'text-gray-700'
                } hover:bg-gray-100`}
                onClick={() => setMenuOpen(false)}
              >
                구매하기
              </Link>
            </li>
            <li>
              <Link
                to="/sell"
                className={`block px-4 py-2 ${
                  isActive('/sell')? 'text-primary font-bold' : 'text-gray-700'
                } hover:bg-gray-100`}
                onClick={() => setMenuOpen(false)}
              >
                판매하기
              </Link>
            </li>
            <li>
              <Link
                to="/login"
                className={`block px-4 py-2 ${
                  isActive('/login') ? 'text-primary font-bold' : 'text-gray-700'
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

export default Navbar;