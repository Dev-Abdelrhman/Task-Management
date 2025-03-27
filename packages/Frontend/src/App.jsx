import PageNotFound from "./component/error404/PageNotFound";
import { Routes, Route } from "react-router-dom";
import Home from "./component/pages/Home";
import Login from "./component/pages/auth/Login";
import SignUp from "./component/pages/auth/SignUp";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Forgetpassword from "./component/pages/auth/ForgetPassword";
import ResetPassword from "./component/pages/auth/ResetPassword";
import Dashboard from "./component/pages/Dashboard";
import { ToastContainer } from "react-toastify";
import Layout from "./shared/Layout";
import Projects from "./component/pages/Projects/Projects";
import CompleteSigninGoogle from "./component/pages/auth/completeSigninGoogle";
import GoogleCallback from "./component/pages/auth/GoogleCallback"; 

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
          <Route path="/google-signup" element={<CompleteSigninGoogle />} />
          <Route path="/forget-password" element={<Forgetpassword />} />
          <Route path="/resetPassword/:token" element ={<ResetPassword />} />
          <Route path="/google-callback" element={<GoogleCallback />} />
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