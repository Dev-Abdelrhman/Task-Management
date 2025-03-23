import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { assets , cursors } from "../../../assets/assets";
import bg from "../../../assets/bg_img.png";
import { toast } from "react-toastify";
import PasswordStrengthMeter from "./PasswordMeter";

const SignUp = () => {
const navigate = useNavigate();
    const [signUpData, setSignUpData] = useState({
       name: "",
       username: "",
       email: "",
       password: "",
       passwordConfirmation: "",
    });

    //useAuth
    const {
        user,
        signUp,
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

        if (signUpData.password !== signUpData.passwordConfirmation) {
        toast.error("Passwords do not match!");
        return;
        }

        try {
        const response = await signUp(signUpData);
        console.log(`${action} successful:`, response);
        toast.success(`welcome ${response.user.name}!`);
        navigate("/");
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
            <h2 className="fs-2 fw-semibold">Create Account</h2>
            <p>Create your account</p>
            <section className="form-signin w-100 m-auto">
              <form 
                onSubmit={handleSubmit} 
                className="grid gap-4 needs-validation" 
                noValidate
                >
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
               
                 <button className="btn btn-primary w-100 py-2 mt-2" type="submit" >
                  Sign Up
                </button>

                  <p className="my-2 text-secondary fs-6">Already have an account?<a href="#" onClick={() => navigate('/Login')}>Login here</a></p>
                
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
}

export default SignUp;
