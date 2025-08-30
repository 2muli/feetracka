import { Navigate, Outlet } from "react-router-dom";
import { ClipLoader } from "react-spinners";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading, userDetails } = useAuth();
if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  if (loading || !userDetails?.user) {
    return (
      <div className="d-flex align-items-center justify-content-center h-screen">
        <ClipLoader
          color="white"
          size={60}   
          speedMultiplier={2}
        />
      </div>
    );
  }

  if (userDetails?.user?.isActive !== 1) {
    return <Navigate to="/for-account-to-activated" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
