import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import bg from "../../assets/bg_img.png";
import { toast } from "react-toastify";
import PasswordStrengthMeter from "./PasswordMeter";
const Login = () => {
  const navigate = useNavigate();
  //states
  const [state, setState] = useState('login');
  const [showSignInPassword, setShowSignInPassword] = useState(false);
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

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
  const cursors = {
    cursor: 'pointer',
  }
//useAuth hook
  const {
    user,
    signIn,
    signUp,
  } = useAuth();

//useEffect
  useEffect(() => {
    setErrorMessage(""); // Clear errors when form state changes
  }, [state]);
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

    if (
      action === "signUp" &&
      signUpData.password !== signUpData.passwordConfirmation
    ) {
      // setErrorMessage("Passwords do not match!");
      toast.error("Passwords do not match!");
      return;
    }

    try {
      const response =
        action === "signIn"
          ? await signIn(signInData)
          : await signUp(signUpData);
      console.log(`${action} successful:`, response);
      toast.success(`welcome ${response.data.user.name}!`);
      setErrorMessage("");
      navigate("/home");
    } catch (error) {
      console.error(`${action} failed:`, error);
      toast.error(
        error?.response?.data?.message || "An unexpected error occurred."
      );
    }
  };

  return (
    <div className="d-md-flex align-items-center justify-content-center flex-column"  style={{ background: `url(${bg})`, height: "100vh" }}>
      <a href="/"><img src={assets.logo} className="position-absolute" alt="logo" style={{ top: "10px", left: "10px" }} /></a>
      <div className="text-center bg-dark-subtle p-5 rounded-3" style={{ width: "500px" }}>
        <h2 className="fs-2 fw-semibold">{state === 'Sign Up' ? 'Create Account' : 'Login'}</h2>
        <p>{state === 'Sign Up' ? 'Create your account' : 'Login to your account!'}</p>
        <section className="form-signin w-100 m-auto">
          <form 
            onSubmit={(e) => handleSubmit(e, state === 'Sign Up' ? 'signUp' : 'signIn')} 
            className="grid gap-4 needs-validation" 
            noValidate
            >
            {state === 'Sign Up' ? (
              <>
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingName"
                    name="name"
                    placeholder="Name"
                    value={signUpData.name}
                    onChange={(e) => handleInputChange(e, setSignUpData)}
                    required
                  />
                  <label htmlFor="floatingName"><img src={assets.person_icon} className="mb-1" /> Your Name</label>
                </div>
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    className="form-control"
                    id="floatingUsername"
                    name="username"
                    placeholder="Username"
                    value={signUpData.username}
                    onChange={(e) => handleInputChange(e, setSignUpData)}
                    required
                  />
                  <label htmlFor="floatingUsername"><img src={assets.person_icon} className="mb-1" /> Username</label>
                </div>
                <div className="form-floating mb-2">
                  <input
                    type="email"
                    className="form-control"
                    id="floatingEmail"
                    name="email"
                    placeholder="name@example.com"
                    value={signUpData.email}
                    onChange={(e) => handleInputChange(e, setSignUpData)}
                    required
                  />
                  <label htmlFor="floatingEmail"><img src={assets.mail_icon} className="mb-1" /> Email address</label>
                </div>
                <div className="form-floating mb-2">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPassword"
                    name="password"
                    placeholder="Password"
                    value={signUpData.password}
                    onChange={(e) => handleInputChange(e, setSignUpData)}
                    required
                  />
                  <label htmlFor="floatingPassword"><img src={assets.lock_icon} className="mb-1" /> Password</label>
                </div>
                <div className="form-floating mb-2">
                  <input
                    type="password"
                    className="form-control"
                    id="floatingPasswordConfirm"
                    name="passwordConfirmation"
                    placeholder="Password confirmation"
                    value={signUpData.passwordConfirmation}
                    onChange={(e) => handleInputChange(e, setSignUpData)}
                    required
                  />
                  <label htmlFor="floatingPasswordConfirm"><img src={assets.lock_icon} className="mb-1" /> Password confirmation</label>
                </div>
                <PasswordStrengthMeter password={signUpData.password} />
              </>
            ) : (
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
              </>
            )}
              <a onClick={() => navigate('/reset-password')} className="text-left border-0 text-black text-decoration-none" style={cursors}>Forgot password?</a>
             <button className="btn btn-primary w-100 py-2 mt-2" type="submit" >
              {state}
            </button>

            {state === 'Sign Up' ? (
              <p className="my-2 text-secondary fs-6">Already have an account? <a href="#" onClick={() => setState('Login')}>Login here</a></p>
            ) : (
              <p className="my-2 text-secondary fs-6">Don't have an account? <a href="#" onClick={() => setState('Sign Up')}> Sign up</a></p>
            )}
          </form>
        </section>
      </div>
    </div>
  );
};

export default Login;