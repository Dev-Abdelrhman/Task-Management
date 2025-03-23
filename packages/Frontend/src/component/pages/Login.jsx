import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { assets , cursors } from "../../assets/assets";
import bg from "../../assets/bg_img.png";
import { toast } from "react-toastify";
const Login = () => {
  const navigate = useNavigate();
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInData, setSignInData] = useState({ email: "", password: "" });

  //styles
  const eyeIconStyleLog = {
    position: 'absolute',
    right: '13px',
    width: '22px',
    top: '50%',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    zIndex: 2
  };

//useAuth hook
  const {
    user,
    signIn,
    googleSignIn,
    isLoading,
  } = useAuth();

//useEffect
  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);
  
//handles functions
  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();

    try {
      const response = await signIn(signInData);
      console.log(`${action} successful:`, response);
      toast.success(`welcome ${response.user.name}!`);
      navigate("/home");
    } catch (error) {
      console.error(`${action} failed:`, error);
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      navigate("/home");
    } catch (error) {
      console.error("Google sign-in failed:", error);
    }
  };

  return (
    <div className="d-md-flex align-items-center justify-content-center flex-column"  style={{ background: `url(${bg})`, height: "100vh" }}>
      <a href="/"><img src={assets.logo} className="position-absolute" alt="logo" style={{ top: "10px", left: "10px" }} /></a>
      <div className="text-center bg-dark-subtle p-5 rounded-3" style={{ width: "500px" }}>
        <h2 className="fs-2 fw-semibold">Login</h2>
        <p>Login to your account!</p>
        <section className="form-signin w-100 m-auto">
          <form 
            onSubmit={handleSubmit} 
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
                    value={signInData.email}
                    onChange={(e) => handleInputChange(e, setSignInData)}
                    required
                  />
                  <label htmlFor="floatingInput"><img src={assets.mail_icon} className="mb-1" /> Email address</label>
                </div>
                <div className="form-floating mb-3">
                  <input
                    type={showSignInPassword ? 'text' : 'password'}
                    className="form-control"
                    id="floatingPassword"
                    name="password"
                    placeholder="Password"
                    value={signInData.password}
                    onChange={(e) => handleInputChange(e, setSignInData)}
                    required
                  />
                  <label htmlFor="floatingPassword"><img src={assets.lock_icon} className="mb-1" /> Password</label>
                  <img
                  src={showSignInPassword ? assets.eye_open_icon : assets.eye_closed_icon}
                  style={eyeIconStyleLog}
                  onClick={() => setShowSignInPassword(!showSignInPassword)}
                  alt="Toggle password visibility"
                />
                </div>
                 <a onClick={() => navigate('/forget-password')} className="text-left border-0 text-black text-decoration-none" style={cursors}>Forgot password?</a>
              </>

             <button className="btn btn-primary w-100 py-2 mt-2" type="submit" >
              Login
            </button>

            <p className="my-2 text-secondary fs-6">Don't have an account? <a href="#" onClick={() => navigate('/sign-up')}> Sign up</a></p>

            {/* google */}
            <div className="container mt-4">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-100 bg-danger text-white py-2 px-4 border-0"
                disabled={isLoading}
              >
                Sign In with Google
              </button>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;