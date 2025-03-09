import PageNotFound from "./component/error404/PageNotFound";
import Footer from "./component/shared/footer";
import Navbar from "./component/shared/Navbar";
import Home from "./component/pages/Home";
import ProtectedRoute from "./component/ProtectedRoute";
import Auth from "./component/pages/Auth";
import { Routes, Route } from "react-router-dom"; 

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
      
    </>
  );
}

export default App;
