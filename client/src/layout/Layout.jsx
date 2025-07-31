import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";
import "./layout.css";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth <= 768) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isSidebarOpen]);

  return (
    <>
      {/* Fixed Top Navbar */}
      <div className="fixed-navbar">
        <Navbar toggleSidebar={toggleSidebar} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      </div>

      {/* Layout Wrapper */}
      <div id="layoutWrapper" className={isSidebarOpen ? "" : "sidebar-hidden"}>
        <div id="sidebarWrapper">
          <Sidebar isSidebarOpen={isSidebarOpen} searchTerm={searchTerm} />
        </div>
        <div id="mainContent">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default Layout;
