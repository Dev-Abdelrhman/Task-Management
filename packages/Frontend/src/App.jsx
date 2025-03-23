import PageNotFound from "./component/error404/PageNotFound";
import { Routes, Route } from "react-router-dom";
import Home from "./component/pages/Home";
import Login from "./component/pages/Login";
import SignUp from "./component/pages/SignUp";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Forgetpassword from "./component/pages/ForgetPassword";
import ResetPassword from "./component/pages/ResetPassword";
import Dashboard from "./component/pages/Dashboard";
import { ToastContainer } from "react-toastify";
import Layout from "./shared/Layout";
import GoogleCallback from "./component/pages/GoogleCallback";
import Projects from "./component/pages/Projects/Projects";

function App() {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Public routes - only accessible when NOT authenticated */}
        <Route element={<ProtectedRoutes isProtected={false} />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/forget-password" element={<Forgetpassword />} />
          <Route path="/resetPassword/:token" element ={<ResetPassword />} />
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
        </Route>

        {/* Protected routes - only accessible when authenticated */}
        <Route element={<ProtectedRoutes />}>
          <Route element={<Layout />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
          </Route>
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;