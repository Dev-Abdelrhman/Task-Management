import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ isProtected = true }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (isProtected) {
    return isAuthenticated ? (
      <Outlet />
    ) : (
      <Navigate to="/login" state={{ from: location }} replace />
    );
  } else {
    // Restrict access if already authenticated
    return isAuthenticated ? (
      <Navigate to="/home" replace />
    ) : (
      <Outlet />
    );
  }
};

export default ProtectedRoutes;