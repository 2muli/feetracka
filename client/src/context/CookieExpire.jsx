import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

const CookieExpire = ({ show, onForceLogout }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await onForceLogout();
    navigate("/login");
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" aria-modal="true" role="dialog" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Session Expired</h5>
          </div>
          <div className="modal-body">Your session has expired. Please login again.</div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={handleLogout}>
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieExpire;
