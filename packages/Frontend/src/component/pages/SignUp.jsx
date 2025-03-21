import React, { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { assets , cursors } from "../../assets/assets";
import bg from "../../assets/bg_img.png";
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
        setErrorMessage("");
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
    <div>
      
    </div>
  )
}

export default SignUp
