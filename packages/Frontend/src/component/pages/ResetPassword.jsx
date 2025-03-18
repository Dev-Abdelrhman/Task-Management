import React , {useEffect , useState} from 'react'
import { useAuth } from '../../hooks/useAuth';
import bg from '../../assets/bg_img.png'
import {toast} from 'react-toastify'
import { assets } from '../../assets/assets';
import { useNavigate } from "react-router-dom";


const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const {
    forgotPassword,
    isLoading,
  } = useAuth();

  const hendleInput = (e) => {

  }

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);
  }

  return ( 
    <div className="d-md-flex align-items-center justify-content-center flex-column"  style={{ background: `url(${bg})`, height: "100vh" }}>
    <a href="/"><img src={assets.logo} className="position-absolute" alt="logo" style={{ top: "10px", left: "10px" }} /></a>
    <div className="text-center bg-dark-subtle p-5 rounded-3" style={{ width: "600px" }}>
      <h2 className="fs-2 fw-semibold py-2">Forgot Password</h2>
      <p className='fw-light fs-5 text-secondary'>Enter your email address and we'll send you a link to reset your password</p>
      <section className="form-signin w-100 m-auto">
        <form 
          className="grid gap-4 needs-validation" 
          noValidate
          >
            <>
              <div className="form-floating mb-2">
                <input
                  type="email"
                  className="form-control"
                  id="floatingInput"
                  name="email"
                  placeholder="name@example.com"
                  // value={signInData.email}
                  // onChange={(e) => handleInputChange(e, setSignInData)}
                  required
                />
                <label htmlFor="floatingInput"><img src={assets.mail_icon} className="mb-1 fs-4" /> Email address</label>
              </div>
            </>
           <button className="btn btn-primary w-100 py-2 my-2" type="submit" >
            Send Reset Link
          </button>

          <a onClick={() => navigate('/login')} className="text-left border-0 text-black text-decoration-none py-2" ><img src={assets.left_Arrow} width={"15px"} /> return to login</a>

        </form>
      </section>
    </div>
  </div>
  )
  
    
}

export default ResetPassword;
