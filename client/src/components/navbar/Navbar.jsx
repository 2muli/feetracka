import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ toggleSidebar, searchTerm, setSearchTerm }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].forEach(el => new window.bootstrap.Tooltip(el));
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const toggleNavbar = () => {
    setIsNavCollapsed(prev => !prev);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
      <Link className="navbar-brand" to="/">Fee Tracka</Link>

      {/* Sidebar toggle button - visible when authenticated */}
      {isAuthenticated && (
        <button
          className="btn btn-link text-white me-2"
          id="sidebarToggle"
          onClick={toggleSidebar}
        >
          <i className="fas fa-bars"></i>
        </button>
      )}

      {/* Mobile user dropdown button - visible only on small screens when authenticated */}
      {isAuthenticated && (
        <div className="d-lg-none">
          <button
            className="nav-link btn btn-link text-white"
            id="mobileUserDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="fas fa-user fa-fw"></i>
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="mobileUserDropdown">
            <li>
              <Link className="dropdown-item" to="/about">About</Link>
            </li>
            <li>
              <Link className="dropdown-item" to="/contact">Contact Us</Link>
            </li>
            <li><hr className="dropdown-divider" /></li>
            <li>
              <button className="dropdown-item" onClick={handleLogout}>Logout</button>
            </li>
          </ul>
        </div>
      )}

      {/* Navbar toggler - only shown when not authenticated */}
      {!isAuthenticated && (
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-controls="navbarContent"
          aria-expanded={!isNavCollapsed}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
      )}

      <div className={`collapse navbar-collapse ${!isNavCollapsed ? "show" : ""}`} id="navbarContent">
        {!isAuthenticated && (
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/contact">Contact Us</Link>
            </li>
          </ul>
        )}

        {isAuthenticated && (
          <form className="d-none d-md-flex ms-auto me-3 my-2">
            <div className="input-group">
              <input
                className="form-control"
                type="text"
                placeholder="Search sidebar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="btn btn-primary" type="button">
                <i className="fas fa-search"></i>
              </button>
            </div>
          </form>
        )}

        {isAuthenticated ? (
          <ul className="navbar-nav">
            <li className="nav-item dropdown d-none d-lg-block">
              <button
                className="nav-link dropdown-toggle btn btn-link text-white"
                id="desktopUserDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="fas fa-user fa-fw"></i>
              </button>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="desktopUserDropdown">
                <li>
                  <Link className="dropdown-item" to="/about">About</Link>
                </li>
                <li>
                  <Link className="dropdown-item" to="/contact">Contact Us</Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item" onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </li>
          </ul>
        ) : (
          <div className="d-flex ms-auto">
            <Link to="/login">
              <button type="button" className="btn btn-outline-secondary me-2">Login</button>
            </Link>
            <Link to="/register">
              <button type="button" className="btn btn-outline-secondary">Register</button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;