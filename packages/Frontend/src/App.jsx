import PageNotFound from "./component/error404/PageNotFound";
import { Routes, Route } from "react-router-dom";
import Home from "./component/pages/Home/Home";
import Login from "./component/pages/auth/Login";
import SignUp from "./component/pages/auth/SignUp";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Forgetpassword from "./component/pages/auth/ForgetPassword";
import ResetPassword from "./component/pages/auth/ResetPassword";
import Dashboard from "./component/pages/dashboard/Dashboard";
import { ToastContainer } from "react-toastify";
import Layout from "./shared/Layout";
import Projects from "./component/pages/Projects/ProjectCard/Projects";
import ProjectDetails from "./component/pages/Projects/ProjectDetails/ProjectDetails";
import ProjectTasks from "./component/pages/Projects/projectTasks/ProjectTasks";
import CompleteSigninGoogle from "./component/pages/auth/completeSigninGoogle";
import GoogleCallback from "./component/pages/auth/GoogleCallback";
import AllTasks from "./component/pages/User_Tasks/AllTasks";
import Settings from "./component/pages/Settings/Setting";
import InviteManagement from "./component/pages/Invite/InviteManagement";
import VerifyEmail from "./component/pages/auth/verifyEmail";

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
