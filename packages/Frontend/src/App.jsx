import PageNotFound from "./component/error404/PageNotFound";
import Footer from "./component/shared/footer";
import Navbar from "./component/shared/Navbar";
import Home from "./component/pages/Home";
import Login from "./component/pages/Login";
import Signup from "./component/pages/Signup";
import ProtectedRoute from "./component/ProtectedRoute";
import Auth from "./component/pages/Auth";
import { Routes, Route } from "react-router-dom"; 

function App() {
  return (
    <>
    <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
    </Routes>
    </>
  );
}

export default App;
