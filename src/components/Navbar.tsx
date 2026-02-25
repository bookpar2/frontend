import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useUserStore from "../stores/useUserStore";
import api from "../baseURL/baseURL";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { refresh, isLoggedIn, logout } = useUserStore();
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleBtnRef = useRef<HTMLButtonElement>(null);
  const navigate = useNavigate();

  const isActive = (path: string) => location.pathname === path;

  const moveToLoginPage = () => navigate("/login");
  const moveToMainPage = () => navigate("/");

  const handleLogout = async () => {
    try {
      const response = await api.post("users/logout/", { refresh });
      setMenuOpen(false);

      if (response.status === 200) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        logout();
        moveToLoginPage();
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  // 메뉴 열렸을 때 스크롤 방지 + ESC 닫기
  useEffect(() => {
    if (!menuOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  // 바깥 클릭 닫기(토글 버튼 클릭은 제외)
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // 토글 버튼을 누른 경우는 바깥 클릭으로 처리하지 않음
      if (toggleBtnRef.current && toggleBtnRef.current.contains(target)) return;

      if (menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false);
      }
    }

    if (menuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const closeMenuAndNavigate = (path: string) => {
    setMenuOpen(false);
    navigate(path);
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full bg-white border-b border-gray-200 h-16 px-6 flex items-center justify-between">
        <img
          src="/images/logo.svg"
          alt="Logo"
          className="select-none cursor-pointer h-8 sm:h-9"
          onClick={moveToMainPage}
        />

        <nav className="hidden md:flex">
          {isLoggedIn ? (
            <>
              <Link
                to="/sell"
                className={`px-4 py-2 ${
                  isActive("/sell") ? "text-primary bg-secondary" : "text-gray-700"
                } hover:bg-gray-100 rounded-lg`}
              >
                판매하기
              </Link>

              <Link
                to="/mypage"
                className={`px-4 py-2 ${
                  isActive("/mypage") ? "text-primary bg-secondary" : "text-gray-700"
                } hover:bg-gray-100 rounded-lg`}
              >
                마이페이지
              </Link>

              <Link
                to="/logout"
                className={`px-4 py-2 ${
                  isActive("/logout") ? "text-primary bg-secondary" : "text-gray-700"
                } hover:bg-gray-100 rounded-lg`}
                onClick={(e) => {
                  e.preventDefault();
                  handleLogout();
                }}
              >
                로그아웃
              </Link>
            </>
          ) : (
            <Link
              to="/login"
              className={`px-4 py-2 ${
                isActive("/login") ? "text-primary bg-secondary" : "text-gray-700"
              } hover:bg-gray-100 rounded-lg`}
            >
              로그인
            </Link>
          )}
        </nav>

        {/* Mobile Right Icons */}
        <div className="md:hidden flex items-center gap-4">
          <button
            ref={toggleBtnRef}
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            <img
              src={menuOpen ? "/images/close.svg" : "/images/menu.svg"}
              alt={menuOpen ? "Close" : "Menu"}
              className="w-6 h-6"
            />
          </button>
        </div>
      </header>

      {menuOpen && (
        <>
          {/* Dim Background */}
          <div
            className="fixed inset-0 z-40 bg-black/40 md:hidden"
            onClick={() => setMenuOpen(false)}
          />

          {/* Dropdown Panel */}
          <div
            ref={menuRef}
            className="fixed top-16 left-0 right-0 z-[45] bg-white md:hidden border-b border-gray-200"
          >
            <ul className="flex flex-col text-center">
              <li>
                <button
                  type="button"
                  className={`w-full py-3 border-b border-gray-200 ${
                    isActive("/") ? "bg-secondary text-primary" : "text-gray-900"
                  }`}
                  onClick={() => closeMenuAndNavigate("/")}
                >
                  구매하기
                </button>
              </li>

              {isLoggedIn ? (
                <>
                  <li>
                    <button
                      type="button"
                      className={`w-full py-3 border-b border-gray-200 ${
                        isActive("/sell") ? "bg-secondary text-primary" : "text-gray-900"
                      }`}
                      onClick={() => closeMenuAndNavigate("/sell")}
                    >
                      판매하기
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      className={`w-full py-3 border-b border-gray-200 ${
                        isActive("/mypage") ? "bg-secondary text-primary" : "text-gray-900"
                      }`}
                      onClick={() => closeMenuAndNavigate("/mypage")}
                    >
                      마이페이지
                    </button>
                  </li>

                  <li>
                    <button
                      type="button"
                      className="w-full py-3  text-alert"
                      onClick={handleLogout}
                    >
                      로그아웃
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    type="button"
                    className={`w-full py-3 ${
                      isActive("/login") ? "bg-secondary text-primary" : "text-gray-900"
                    }`}
                    onClick={() => closeMenuAndNavigate("/login")}
                  >
                    로그인
                  </button>
                </li>
              )}
            </ul>
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
