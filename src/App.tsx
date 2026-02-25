import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { ReactNode } from "react";

import MainPage from "./pages/MainPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import SellPage from "./pages/SellPage";
import DetailPage from "./pages/DetailPage";
import MyPage from "./pages/MyPage";

import useUserStore from "./stores/useUserStore";
import DefaultLayout from "./layouts/DefaultLayout";

import "./App.css";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLoggedIn } = useUserStore();
  if (!isLoggedIn) return <Navigate to="/login" replace />;
  return children;
}

const App = () => {
  return (
    <Router>
      <div className="w-full min-w-[375px] h-dvh overflow-x-hidden">
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path="/" element={<MainPage />} />

            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* 로그인한 사용자만 */}
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
          </Route>
        </Routes>
      </div>
    </Router>
  );
}

export default App;
