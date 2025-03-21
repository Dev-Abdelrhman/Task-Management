import {assets} from '../../assets/assets'
import { useNavigate } from 'react-router-dom';


function Navbar() {
    const navigate = useNavigate();
    return (
        <div>
            <div className="container">
                <div className="d-flex flex-wrap align-items-center justify-content-center justify-content-lg-start py-3 mb-4 ">
                    <a href="/" className="d-flex align-items-center mb-2 mb-lg-0 text-white text-decoration-none">
                        <img src={assets.logo} alt="logo" width="130" />
                    </a>

                    <ul className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">

                    </ul>

                    <div className="text-end ">
                    <button type="button" className="btn btn-outline-dark me-2 rounded-pill px-4 py-2 align-items-center"
                    onClick={()=> navigate("/login")}
                    >Login<img src={assets.arrow_icon} className='px-1 mb-1'/></button>
                    <button type="button" className="btn btn-warning me-2 rounded-pill px-4 py-2 align-items-center"
                    onClick={()=> navigate("/sign-up")}
                    >Sign-up<img src={assets.arrow_icon} className='px-1 mb-1'/></button>
                    </div>
                </div>
            </div>
        </div>          
    )
}

export default Navbar;