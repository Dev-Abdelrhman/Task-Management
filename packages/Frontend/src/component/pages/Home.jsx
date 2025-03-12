import Navbar from "../shared/Navbar";
import Header from "../pages/Header";
import  bg  from "../../assets/bg_img.png";

function Home() {
    return (
        <div style={{background: `url(${bg})`,}}>
            <Navbar/>
            <Header/>
        </div>
    )
}

export default Home;