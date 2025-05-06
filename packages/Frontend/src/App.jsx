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
import ProjectDetails from "./component/pages/Projects/ProjectDetails";
import ProjectTasks from "./component/pages/Projects/ProjectTasks";
import CompleteSigninGoogle from "./component/pages/auth/completeSigninGoogle";
import GoogleCallback from "./component/pages/auth/GoogleCallback";
import AllTasks from "./component/pages/User_Tasks/AllTasks";
import Settings from "./component/pages/Setting";
import InviteManagement from "./component/pages/Invite/InviteManagement";

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
