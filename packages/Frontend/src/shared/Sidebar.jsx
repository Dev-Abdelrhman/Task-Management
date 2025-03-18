import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
function Sidebar() {
    return <>


        <div>
            <div className="container">
                {/* LOGO */}
                <div className='d-flex justify-content-center align-items-center gap-2 pt-5 mb-5'>
                    <img src={logo} alt="" />
                    <h1 className='fs-1'>Sidebar</h1>
                </div>


                {/* Content */}
                <div>
                    <ul className='text-left ms-5'>
                        <li className='fs-3 fw-normal mb-4'>
                            <Link to="/">
                                <div className='d-flex  align-items-center '>
                                    <div className='me-3'>
                                        <i className="fa-solid fa-house"></i>
                                    </div>
                                    <span className='fw-semibold'>Overview</span>
                                </div>
                            </Link>
                        </li>
                       
                        <li className='fs-3 fw-normal mb-4'>
                            <a href="">
                                <div className='d-flex  align-items-center '>
                                    <div className='me-3'>
                                        <i className="fa-solid fa-house"></i>
                                    </div>
                                    <span className='fw-semibold'>Projects</span>
                                </div>
                            </a>
                        </li>
                       
                        <li className='fs-3 fw-normal mb-4'>
                            <a href="">
                                <div className='d-flex  align-items-center '>
                                    <div className='me-3'>
                                        <i className="fa-solid fa-house"></i>
                                    </div>
                                    <span className='fw-semibold'>All Tasks</span>
                                </div>
                            </a>
                        </li>
                       
                        <li className='fs-3 fw-normal mb-4'>
                            <a href="">
                                <div className='d-flex  align-items-center '>
                                    <div className='me-3'>
                                    <i className="fa-solid fa-gear"></i>
                                    </div>
                                    <span className='fw-semibold'>Settings</span>
                                </div>
                            </a>
                        </li>
                       
                    </ul>

                </div>

            </div>
        </div>
    </>
}

export default Sidebar;