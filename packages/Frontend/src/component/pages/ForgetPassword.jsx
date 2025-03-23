import React , {useEffect , useState} from 'react'
import { useAuth } from '../../hooks/useAuth';
import bg from '../../assets/bg_img.png'
import {toast} from 'react-toastify'
import { assets ,cursors } from '../../assets/assets';
import { useNavigate } from "react-router-dom";


const Forgetpassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [success, setSuccess] = useState(false);


  
  const {
    forgotPassword,
    isLoading,
  } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await forgotPassword(email);
      setIsSubmitted(true)
      setEmail("");
      // toast.success("Password reset instructions have been sent to your email.");
    } catch (error) {
      console.error("Forgot password failed:", error);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setSuccess(false);
    }
  };

  return ( 
    
    <div className="d-md-flex align-items-center justify-content-center flex-column"  style={{ background: `url(${bg})`, height: "100vh" }}>
    <a href="/"><img src={assets.logo} className="position-absolute" alt="logo" style={{ top: "10px", left: "10px" }} /></a>
    <div className="text-center bg-dark-subtle p-5 rounded-3" style={{ width: "600px" }}>
      <h2 className="fs-2 fw-semibold py-2">Forgot Password</h2>
      {!isSubmitted ? (<>
      <p className='fw-light fs-5 text-secondary'>Enter your email address and we'll send you a link to reset your password</p>
      <section className="form-signin w-100 m-auto">
        <form onSubmit={handleSubmit}
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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <label htmlFor="floatingInput"><img src={assets.mail_icon} className="mb-1" /> Email address</label>
              </div>
            </>
           <button className="btn btn-primary w-100 py-2 my-2" type="submit" disabled={isLoading}>
            Send Reset Link
          </button>
          <a onClick={() => navigate('/login')} style={cursors} className="text-left border-0 text-black text-decoration-none py-2" ><img src={assets.left_Arrow} width={"15px"} /> return to login</a>

        </form>
      </section>
      </>):(
        <>
          <p className='text-secondary py-2 mb-5'>
            A reset link has been sent to your email {email}. Please check your email you will receive a password reset link shortly
          </p>
        </>
      )}
     
    </div>
  </div>
  )

}

export default Forgetpassword;
