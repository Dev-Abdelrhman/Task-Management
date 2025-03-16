import Navbar from "../shared/Navbar";
import Header from "../pages/Header";
import  bg  from "../../assets/bg_img.png";
import { assets } from "../../assets/assets";


function Home() {
  

    return (
        <div style={{background: `url(${bg})`, height: "100vh"}}>
            <Navbar/>
            <Header/>
        </div>
    )
}

export default Home;