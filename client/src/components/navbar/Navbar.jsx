import { confirmDialog } from "primereact/confirmdialog";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../context/AuthContext";

const Navbar = ({ toggleSidebar, searchTerm, setSearchTerm }) => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    [...tooltipTriggerList].forEach(el => new window.bootstrap.Tooltip(el));
  }, []);

  const handleLogout = (e) => {
    e.preventDefault();
    confirmDialog({
      message: 'Are you sure you want to proceed?',
      header: 'Logout Confirmation',
      icon: 'pi pi-sign-out',
      acceptClassName: 'p-button-warning',
      accept: async () => {
        try {
          await logout();
          navigate("/login");
        } catch (err) {
          toast.error("Failed to logout. If error persists, contact support.");
        }
      },
      reject: () => {
        toast.info("Logout cancelled.");
      }
    });
  };

  const toggleNavbar = () => {
    setIsNavCollapsed(prev => !prev);
  };

  return (
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark px-3">
        <Link className="navbar-brand" to="/">Fee Tracka</Link>

        {isAuthenticated && (
          <button
            className="btn btn-link text-white me-2"
            id="sidebarToggle"
            onClick={toggleSidebar}
          >
            <i className="fas fa-bars"></i>
          </button>
        )}

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
              <li><Link className="dropdown-item" to="/about">About</Link></li>
              <li><Link className="dropdown-item" to="/contact">Contact Us</Link></li>
              <li><hr className="dropdown-divider" /></li>
              <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
            </ul>
          </div>
        )}

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
              <li className="nav-item"><Link className="nav-link" to="/">Home</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/about">About</Link></li>
              <li className="nav-item"><Link className="nav-link" to="/contact">Contact Us</Link></li>
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
                  <li><Link className="dropdown-item" to="/about">About</Link></li>
                  <li><Link className="dropdown-item" to="/contact">Contact Us</Link></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><button className="dropdown-item" onClick={handleLogout}>Logout</button></li>
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
