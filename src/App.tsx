import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainPage from './pages/MainPage';
import LoginPage from './pages/LoginPage';
import Navbar from './components/Navbar';
import RegisterPage from './pages/RegisterPage';

const App: React.FC = () => {
  return (
    <Router>
      <div className="w-full min-w-[375px] min-h-screen overflow-x-hidden">
        <Navbar />
        <Routes>
          <>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </>
        </Routes>
      </div>
    </Router>
  );
};

export default App;