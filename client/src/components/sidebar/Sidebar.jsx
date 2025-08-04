import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./sidebar.css";

const Sidebar = ({ isSidebarOpen, searchTerm }) => {
  const { isAuthenticated, userDetails } = useAuth();
  const location = useLocation();
  const isAdmin=userDetails?.user?.role;

  if (!isAuthenticated) return null;

  const normalizedSearch = searchTerm?.toLowerCase() || "";
  const isFeeActive = ["/viewPayment", "/viewremedialpayments"].some(path =>
    location.pathname.includes(path)
  );

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
        ...(isAdmin ? [{ to: "/viewusers", icon: "bi bi-people", label: "Users" }] : []),
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
    <nav
      id="sidebar"
      className={`bg-dark text-white p-3 d-flex flex-column ${isSidebarOpen ? "open" : "collapsed"}`}
    >
      {/* Scrollable content */}
      <div className="flex-grow-1 overflow-auto pe-2">
        <ul className="list-unstyled">
          {menuGroups.map((group, idx) => {
            const filteredLinks = group.links.filter(link =>
              link.label.toLowerCase().includes(normalizedSearch)
            );

            if (filteredLinks.length === 0 && group.heading !== "Menu") return null;

            return (
              <div key={idx}>
                <div className="text-uppercase text-secondary small fw-bold px-3 mt-3 mb-1">
                  {group.heading}
                </div>
                {filteredLinks.map((link, i) => (
                  <li key={i}>
                    <Link
                      to={link.to}
                      className={location.pathname === link.to ? "active" : ""}
                    >
                      <i className={`${link.icon} me-2`}></i> {link.label}
                    </Link>
                  </li>
                ))}

                {group.heading === "Menu" &&
                  (["fee", "remedial"].some(term => normalizedSearch.includes(term)) ||
                    normalizedSearch === "") && (
                    <li>
                      <a
                        className={collapsedClass}
                        href="#"
                        data-bs-toggle="collapse"
                        data-bs-target="#collapseFeeStructure"
                        aria-expanded={isFeeActive}
                        aria-controls="collapseFeeStructure"
                      >
                        <i className="fas fa-columns me-2"></i> School Fees
                        <i className="fas fa-angle-down float-end"></i>
                      </a>
                      <div
                        className={collapseClass}
                        id="collapseFeeStructure"
                        data-bs-parent="#sidebar"
                      >
                        <ul className="list-unstyled ps-3">
                          <li>
                            <Link
                              to="/viewPayment"
                              className={location.pathname === "/viewPayment" ? "active" : ""}
                            >
                              <i className="bi bi-coin me-1" />For Fee
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="/viewremedialpayments"
                              className={
                                location.pathname === "/viewremedialpayments" ? "active" : ""
                              }
                            >
                              <i className="bi bi-coin me-1" />For Remedial
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </li>
                  )}
              </div>
            );
          })}
        </ul>
      </div>

      {/* Footer fixed at bottom inside sidebar */}
   {/* Footer fixed at bottom inside sidebar */}
<div className="text-white p-2 mt-auto small">
  <Link to="/profile" style={{ color: "white", textDecoration: "none" }}>
    <div className="small">Logged in as:</div>
    {userDetails?.user?.firstName && userDetails?.user?.lastName ? (
      <>
        {userDetails.user.firstName} {userDetails.user.lastName}
      </>
    ) : (
      "Malioni Clerk"
    )}
  </Link>
</div>

    </nav>
  );
};

export default Sidebar;
