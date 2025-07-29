import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ searchTerm }) => {
  const { isAuthenticated, userDetails } = useAuth();
  const location = useLocation();
  const normalizedSearch = searchTerm?.toLowerCase() || "";

  if (!isAuthenticated) return null;

  const isFeeActive = ["/viewPayment", "/viewremedialpayments"].some(path => location.pathname.includes(path));
  const collapseClass = isFeeActive ? "collapse show" : "collapse";
  const collapsedClass = isFeeActive ? "nav-link" : "nav-link collapsed";

  const menuGroups = [
    {
      heading: "Core",
      links: [{ to: "/dashboard", icon: "fas fa-tachometer-alt", label: "Dashboard" }],
    },
    {
      heading: "Menu",
      links: [
        { to: "/viewstudents", icon: "bi bi-people", label: "Students" },
        { to: "/viewfee", icon: "bi bi-cash-coin", label: "Fees" },
        { to: "/remedial", icon: "bi bi-cash-coin", label: "Remedials" },
      ],
    },
    {
      heading: "Account",
      links: [
        { to: "/profile", icon: "bi bi-person-circle", label: "Profile" },
        { to: "/manage", icon: "bi bi-gear", label: "Manage Account" },
        { to: "/changepassword", icon: "bi bi-gear-wide-connected", label: "Change Password" },
      ],
    },
  ];

  return (
    <nav className="sb-sidenav accordion sb-sidenav-dark" id="sidenavAccordion">
      <div className="sb-sidenav-menu">
        <div className="nav">
          {menuGroups.map((group, idx) => {
            const filteredLinks = group.links.filter(link =>
              link.label.toLowerCase().includes(normalizedSearch)
            );

            if (filteredLinks.length === 0 && group.heading !== "Menu") return null;

            return (
              <div key={idx}>
                <div className="sb-sidenav-menu-heading">{group.heading}</div>
                {filteredLinks.map((link, i) => (
                  <Link to={link.to} className="nav-link" key={i}>
                    <div className="sb-nav-link-icon"><i className={link.icon}></i></div>
                    {link.label}
                  </Link>
                ))}

                {group.heading === "Menu" && (
                  <>
                    {["fee", "remedial"].some(term => normalizedSearch.includes(term)) || normalizedSearch === "" ? (
                      <>
                        <a
                          className={collapsedClass}
                          href="#"
                          data-bs-toggle="collapse"
                          data-bs-target="#collapseFeeStructure"
                          aria-expanded={isFeeActive}
                          aria-controls="collapseFeeStructure"
                        >
                          <div className="sb-nav-link-icon"><i className="fas fa-columns"></i></div>
                          Payment Statement
                          <div className="sb-sidenav-collapse-arrow">
                            <i className="fas fa-angle-down"></i>
                          </div>
                        </a>
                        <div className={collapseClass} id="collapseFeeStructure" data-bs-parent="#sidenavAccordion">
                          <nav className="sb-sidenav-menu-nested nav">
                            <Link to="/viewPayment" className="nav-link"><i className="bi bi-coin m-1" />Payment</Link>
                            <Link to="/viewremedialpayments" className="nav-link"><i className="bi bi-coin m-1" />Remedial Payments</Link>
                          </nav>
                        </div>
                      </>
                    ) : null}
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <div className="sb-sidenav-footer text-white text-center p-2">
        <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
          <div className="small">Logged in as:</div>
          {userDetails?.firstName} {userDetails?.lastName || 'Malioni Clerk'}
        </Link>
      </div>
    </nav>
  );
};

export default Sidebar;
