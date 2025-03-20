import PageNotFound from "./component/error404/PageNotFound";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./component/pages/Home";
import Login from "./component/pages/Login";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import ResetPassword from "./component/pages/ResetPassword";
import Dashboard from "./component/pages/Dashboard";
import { useAuth } from "./hooks/useAuth";
import { ToastContainer } from "react-toastify";
import Layout from "./shared/Layout";
<<<<<<< HEAD
import GoogleCallback from "./component/pages/GoogleCallback";
=======
import Projects from "./component/pages/Projects/Projects";
>>>>>>> 8d46536f83b6da783846b4238d4ff1ec97e43b0d
function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        <Route element={<ProtectedRoutes />}>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />


            <Route path="*" element={<PageNotFound />} />
          </Route>
        </Route>

        {/* Redirect root path based on auth status */}
        <Route path="/" element={<HomeOrRedirect />} />

        <Route element={<ProtectedRoutes isProtected={false} />}>
          <Route path="/login" element={<Login />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} /> 
        </Route>
        
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

const HomeOrRedirect = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" replace /> : <Home />;
};

export default App;