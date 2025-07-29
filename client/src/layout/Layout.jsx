import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import "./layout.css";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev);
  };

  return (
    <div className="sb-nav-fixed">
      <Navbar toggleSidebar={toggleSidebar} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <div id="layoutSidenav" className={isSidebarOpen ? "sb-sidenav-open" : "sb-sidenav-closed"}>
        <div id="layoutSidenav_nav">
          <Sidebar searchTerm={searchTerm} />
        </div>
        <div id="layoutSidenav_content">
          <main className="main">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;
