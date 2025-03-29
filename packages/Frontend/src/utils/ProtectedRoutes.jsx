import { useAuth } from "../hooks/useAuth";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoutes = ({ isProtected = true }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <div>Loading...</div>;
  console.log(isAuthenticated);
  
  const hasValidToken = localStorage.getItem("accessToken") || document.cookie.includes("accessToken");
  // console.log(document.cookie.includes("accessToken")); 
  // console.log(localStorage.getItem("accessToken")); 
  
  
  if (isProtected) {
    return isAuthenticated ? (
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