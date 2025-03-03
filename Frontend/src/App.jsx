import { Route, Routes } from "react-router-dom";
import PageNotFound from "./component/error404/PageNotFound";
import Footer from "./component/shared/footer";
import Navbar from "./component/shared/Navbar";
import Home from "./component/pages/Home";

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
