import PageNotFound from "./component/error404/PageNotFound";
import { Routes, Route , Navigate } from "react-router-dom"; 
import Home from "./component/pages/Home";
import Login from "./component/pages/Login";
import ProtectedRoutes from "./utils/ProtectedRoutes";
import Dashboard from "./component/pages/Dashboard";
import { useAuth } from "./hooks/useAuth";

function App() {
  return (
    <Routes>
      <Route element={<ProtectedRoutes />}>
        <Route path="/home" element={<Dashboard />} />
      </Route>
      
      {/* Redirect root path based on auth status */}
      <Route path="/" element={<HomeOrRedirect />} />
      
      <Route path="/login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}

// New component to handle root path logic
const HomeOrRedirect = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/home" replace /> : <Home />;
};

export default App;
