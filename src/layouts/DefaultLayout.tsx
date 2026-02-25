import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const DefaultLayout = () => {
  return (
    <div className={`flex h-dvh flex-col`}>
      {/* Header */}
      <Navbar />

      {/* Header 아래 컨텐츠 영역 */}
      <main id="app-scroll-container" className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default DefaultLayout;
