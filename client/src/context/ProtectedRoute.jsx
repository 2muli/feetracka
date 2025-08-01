import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = () => {
  const { isAuthenticated, loading, userDetails } = useAuth();

  if (loading || !userDetails?.user) return <div>Loading...</div>;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (userDetails?.user?.isActive !== 1) {
    return <Navigate to="/for-account-to-activated" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
