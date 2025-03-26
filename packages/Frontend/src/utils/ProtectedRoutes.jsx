import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ isProtected = true }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;
  
  // Add token check as fallback
  const hasToken = !!localStorage.getItem("accessToken");

  if (isProtected) {
    return isAuthenticated || localStorage.getItem("accessToken") ? (
      <Outlet />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  } else {
    return isAuthenticated ? (
      <Navigate to="/home" replace />
    ) : (
      <Outlet />
    );
  }
};

export default ProtectedRoutes;