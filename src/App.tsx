import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';
import SellPage from './pages/SellPage';
import DetailPage from './pages/DetailPage';
import MyPage from './pages/MyPage';
import useUserStore from './stores/useUserStore';
import { ReactNode } from 'react';

interface ProtectedRouteProps {
  children: ReactNode;
}

// 로그인 상태를 체크하는 ProtectedRoute 컴포넌트
function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { isLoggedIn } = useUserStore();

  if (!isLoggedIn) {
    // 로그인하지 않은 경우, 로그인 페이지로 리디렉션
    return <Navigate to="/login" replace />;
  }
  return children;
}

function App() {
  return (
    <Router>
      <div className="w-full min-w-[375px] min-h-screen overflow-x-hidden">
        <Navbar />
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* 로그인한 사용자만 접근 가능 */}
          <Route
            path="/sell"
            element={
              <ProtectedRoute>
                <SellPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/edit/:book_id"
            element={
              <ProtectedRoute>
                <SellPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/detail/:book_id"
            element={
              <ProtectedRoute>
                <DetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mypage"
            element={
              <ProtectedRoute>
                <MyPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;