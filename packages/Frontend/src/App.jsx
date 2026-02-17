import PageNotFound from "./pages/error404/PageNotFound";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/auth/Login";
import SignUp from "./pages/auth/SignUp";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Forgetpassword from "./pages/auth/ForgetPassword";
import ResetPassword from "./pages/auth/ResetPassword";
import Dashboard from "./pages/dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import Layout from "./shared/Layout";
import Projects from "./pages/Projects/Projects";
import ProjectDetails from "./pages/Projects/ProjectDetails/ProjectDetails";
import ProjectTasks from "./pages/Projects/projectTasks/ProjectTasks";
import CompleteSigninGoogle from "./pages/auth/completeSigninGoogle";
import GoogleCallback from "./pages/auth/GoogleCallback";
import AllTasks from "./pages/User_Tasks/AllTasks";
import Settings from "./pages/Settings/Setting";
import InviteManagement from "./pages/Invite/InviteManagement";
import VerifyEmail from "./pages/auth/verifyEmail";

function App() {
  return (
    <>
      <ToastContainer
        autoClose={2000}
        newestOnTop
        closeOnClick
        draggable
        pauseOnHover
        toastClassName="mobile-toast"
      />
      <Routes>
        {/* Public routes - only accessible when NOT authenticated */}
        <Route element={<ProtectedRoutes isProtected={false} />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/sign-up/continue" element={<VerifyEmail />} />
          <Route path="/google-signup" element={<CompleteSigninGoogle />} />
          <Route path="/forget-password" element={<Forgetpassword />} />
          <Route path="/resetPassword/:token" element={<ResetPassword />} />
          <Route path="/google-signin" element={<GoogleCallback />} />
        </Route>

        {/* Protected routes - only accessible when authenticated */}
        <Route element={<ProtectedRoutes />}>
          <Route path="/home" element={<Dashboard />} />
          <Route element={<Layout />}>
            <Route path="/projects" element={<Projects />} />
            <Route
              path="/projects/ProjectDetails/:projectId"
              element={<ProjectDetails />}
            />
            <Route
              path="/projects/users/:userId/projects/:projectId/tasks"
              element={<ProjectTasks />}
            />
            <Route path="/user-tasks" element={<AllTasks />} />
            <Route path="/invites" element={<InviteManagement />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* 404 catch-all */}
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </>
  );
}

export default App;
