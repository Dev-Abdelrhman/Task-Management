import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordStrengthMeter from "./PasswordMeter";
import { User, Mail, Lock } from "lucide-react";
import TextField from "@mui/material/TextField";
import AuthLayout from "./AuthLayout";
import AuthForm from "./AuthForm";

const SignUp = () => {
  const navigate = useNavigate();
  const [signUpData, setSignUpData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/;
  const usernameRegex =
    /^(?=.{3,30}$)(?!.*[.]{2})[a-zA-Z0-9](?:[a-zA-Z0-9.]*[a-zA-Z0-9])?$/;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const getPasswordRequirements = () =>
    "Password must be at least 8 characters, include uppercase, lowercase, a number, and a special character (@$!%?&).";
  const getUsernameRequirements = () =>
    "Username must be 3-30 characters, letters, numbers, dots (no consecutive dots, cannot start/end with dot).";

  const { user, signUp, googleSignIn, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignUpData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (
      !signUpData.name ||
      !signUpData.username ||
      !signUpData.email ||
      !signUpData.password ||
      !signUpData.passwordConfirmation
    ) {
      toast.error("Please fill in all fields");
      return false;
    }

    if (!emailRegex.test(signUpData.email)) {
      toast.error("Please enter a valid email address");
      return false;
    }

    if (!usernameRegex.test(signUpData.username)) {
      toast.error(getUsernameRequirements());
      return false;
    }

    if (!passwordRegex.test(signUpData.password)) {
      toast.error(getPasswordRequirements());
      return false;
    }

    if (signUpData.password !== signUpData.passwordConfirmation) {
      toast.error("Passwords do not match!");
      return false;
    }

    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    signUp(signUpData);
  };

  const handleGoogleSignIn = () => {
    googleSignIn();
  };

  return (
    <AuthLayout>
      <AuthForm
        title="Sign-up"
        subtitle="Create your account!"
        onSubmit={handleSubmit}
        submitText="Sign Up"
        isLoading={isLoading}
        googleButtonText="Sign Up with Google"
        onGoogleClick={handleGoogleSignIn}
        footerText="Do you have an account?"
        footerLinkText="Sign In"
        onFooterLinkClick={() => navigate("/login")}
      >
        <div className="space-y-2">
          <div>
            <TextField
              id="Name"
              label={
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span>Name</span>
                </div>
              }
              variant="outlined"
              name="name"
              value={signUpData.name}
              onChange={handleInputChange}
              type="text"
              placeholder="Your Name"
              className="pl-10 py-6 focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
              required
              InputLabelProps={{ required: false }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div>
            <TextField
              id="username"
              label={
                <div className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-400" />
                  <span>Username</span>
                </div>
              }
              variant="outlined"
              name="username"
              value={signUpData.username}
              onChange={handleInputChange}
              type="text"
              required
              placeholder="Username"
              className="pl-10 py-6 focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
              InputLabelProps={{ required: false }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <TextField
              id="Email"
              label={
                <div className="flex items-center gap-2">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <span>Email</span>
                </div>
              }
              type="email"
              placeholder="Email address"
              name="email"
              value={signUpData.email}
              onChange={handleInputChange}
              className="pl-10 py-6 focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
              required
              InputLabelProps={{ required: false }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <TextField
              id="Password"
              label={
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <span>Password</span>
                </div>
              }
              type="password"
              placeholder="Password"
              name="password"
              value={signUpData.password}
              onChange={handleInputChange}
              className="pl-10 py-6 focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
              required
              InputLabelProps={{ required: false }}
            />
          </div>
        </div>
        <div className="space-y-2">
          <div className="relative">
            <TextField
              id="outlined-basic"
              label={
                <div className="flex items-center gap-2">
                  <Lock className="h-5 w-5 text-gray-400" />
                  <span>Password Confirmation</span>
                </div>
              }
              type="password"
              placeholder="Password Confirmation"
              name="passwordConfirmation"
              value={signUpData.passwordConfirmation}
              onChange={handleInputChange}
              className="pl-10 py-6 focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
              required
              InputLabelProps={{ required: false }}
            />
          </div>
        </div>

        {signUpData.password && (
          <PasswordStrengthMeter password={signUpData.password} />
        )}
      </AuthForm>
    </AuthLayout>
  );
};

export default SignUp;
