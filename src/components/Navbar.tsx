import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import useUserStore from '../stores/useUserStore';
import api from '../baseURL/baseURL';

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { refresh, isLoggedIn, logout } = useUserStore();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const moveToMainPage = () => {
    navigate('/login');
  }

  const handleLogout = async() => {
    try {
      const response = await api.post('users/logout/', {
        refresh: refresh
      })

      setMenuOpen(false);

      if(response.status === 200) {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        logout();
        moveToMainPage();
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  // 외부 클릭 감지를 위한 useEffect
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  return (
    <header className="fixed top-0 z-[60] w-full bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center">
      <Link to="/">
        <img src="/images/logo.svg" alt="Logo" className="h-8 pl-1 select-none" />
      </Link>
      
      {/* Desktop Navigation */}
      <nav className="hidden md:flex">
        {isLoggedIn ? (
          <>
            <Link to="/sell" className={`px-4 py-2 ${isActive('/sell') ? 'text-primary font-bold' : 'text-gray-700'} hover:bg-gray-100 rounded-lg`}>
              판매하기
            </Link>
            <Link to="/chat" className={`px-4 py-2 ${isActive('/chat')? 'text-primary font-bold' : 'text-gray-700'} hover:bg-gray-100 rounded-lg`}>
              채팅하기
            </Link>
            <Link to="/mypage" className={`px-4 py-2 ${isActive('/mypage')? 'text-primary font-bold' : 'text-gray-700'} hover:bg-gray-100 rounded-lg`}>
              마이페이지
            </Link>
            <Link to="/logout"
              className={`px-4 py-2 ${isActive('/logout')? 'text-primary font-bold' : 'text-gray-700'} hover:bg-gray-100 rounded-lg`}
              onClick={handleLogout}
            >
              로그아웃
            </Link>
          </>
        ) : (
          <Link to="/login" className={`px-4 py-2 ${isActive('/login') ? 'text-primary font-bold' : 'text-gray-700'} hover:bg-gray-100 rounded-lg`}>
            로그인
          </Link>
        )}
      </nav>
      
      {/* Mobile Menu */}
      <div className="md:hidden flex space-x-2 items-center">
        {/* {isLoggedIn && (
          <Link to="/">
            <img src="/images/search.svg" alt="Search" className="w-6 h-6" />
          </Link>
        )} */}
        <button onClick={() => setMenuOpen(!menuOpen)}>
          <img src="/images/menu.svg" alt="Menu" className="w-6 h-6" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div ref={menuRef} className="absolute top-16 right-6 w-48 bg-white shadow-lg border rounded-lg z-10 md:hidden">
          {isLoggedIn ? (
            <ul className="flex flex-col">
              <li>
                <Link
                  to="/sell"
                  className={`block px-4 py-2 ${
                    isActive('/sell') ? 'text-primary font-bold' : 'text-gray-700'
                  } hover:bg-gray-100`}
                  onClick={() => setMenuOpen(false)}
                >
                  판매하기
                </Link>
              </li>
              <li>
                <Link
                  to="/chat"
                  className={`block px-4 py-2 ${
                    isActive('/chat') ? 'text-primary font-bold' : 'text-gray-700'
                  } hover:bg-gray-100`}
                  onClick={() => setMenuOpen(false)}
                >
                  채팅하기
                </Link>
              </li>
              <li>
                <Link
                  to="/mypage"
                  className={`block px-4 py-2 ${
                    isActive('/mypage') ? 'text-primary font-bold' : 'text-gray-700'
                  } hover:bg-gray-100`}
                  onClick={() => setMenuOpen(false)}
                >
                  마이페이지
                </Link>
              </li>
              <li>
                <div
                  className={`block px-4 py-2 ${
                    isActive('/logout')? 'text-primary font-bold' : 'text-gray-700'
                  } hover:bg-gray-100`}
                  onClick={() => {
                    handleLogout();
                  }}
                >
                  로그아웃
                </div>
              </li>
            </ul>
          ) : (
            <ul className="flex flex-col">
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
          )}
        </div>
      )}
    </header>
  );
}

export default Navbar;