import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/navbar/Navbar";
import Sidebar from "../components/sidebar/Sidebar";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  useEffect(() => {
    if (isSidebarOpen) {
      document.body.classList.add("sidebar-open");
    } else {
      document.body.classList.remove("sidebar-open");
    }

    return () => {
      document.body.classList.remove("sidebar-open");
    };
  }, [isSidebarOpen]);

  return (
    <div className="layout-root">
      <div className="fixed-navbar">
        <Navbar
          toggleSidebar={toggleSidebar}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      <div className={`layout-body ${isSidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-area">
          <Sidebar isSidebarOpen={isSidebarOpen} searchTerm={searchTerm} />
        </div>

        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
