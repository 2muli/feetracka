import { Navigate, Outlet } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading, userDetails } = useAuth();

  if (loading || !userDetails?.user) {
    return (
      <div className="d-flex align-items-center justify-content-center vh-100 bg-white">
        <ClipLoader
          color="#3b4c0a"
          size={60}
          speedMultiplier={2}
        />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userDetails?.user?.isActive !== 1) {
    return <Navigate to="/for-account-to-activated" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
