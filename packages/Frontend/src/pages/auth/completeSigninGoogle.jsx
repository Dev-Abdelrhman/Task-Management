import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/auth/useAuth";
import { toast } from "react-toastify";
import { User, Lock } from "lucide-react";
import { Button, TextField } from "@mui/material";
import { jwtDecode } from "jwt-decode";
import AuthLayout from "./AuthLayout";
import AuthForm from "./AuthForm";

const CompleteSigninGoogle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { continueWithGoogle, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    passwordConfirmation: "",
  });
  const [userData, setUserData] = useState(null);
  const [token, setToken] = useState("");

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenFromURL = queryParams.get("token");

    if (!tokenFromURL) {
      toast.error("Missing authentication token");
      return;
    }

    try {
      const decoded = jwtDecode(tokenFromURL);
      setUserData({
        name: decoded.name,
        email: decoded.email,
        image:
          decoded.image.replace(/=s96-c$/, "=s400-c") ||
          decoded.picture.replace(/=s96-c$/, "=s400-c"),
      });
      setToken(tokenFromURL);
    } catch {
      toast.error("Invalid or expired token. Please restart the process.");
    }
  }, [location.search]);

  const hostGoogleImage = (url) => {
    return `https://images.weserv.nl/?url=${encodeURIComponent(
      url,
    )}&w=200&h=200`;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.password) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long.");
      return;
    }

    if (formData.password !== formData.passwordConfirmation) {
      toast.error("Passwords don't match");
      return;
    }

    if (!token) {
      toast.error("Invalid authentication session. Please try again.");
      return;
    }

    await continueWithGoogle({
      token,
      username: formData.username,
      password: formData.password,
      passwordConfirmation: formData.passwordConfirmation,
    });
  };

  if (!userData) return null;

  return (
    <AuthLayout>
      <AuthForm
        title="Complete Sign Up"
        subtitle="Finish setting up your account"
        onSubmit={handleSubmit}
        submitText="Complete Sign Up"
        isLoading={isLoading}
        footerText="Already have an account?"
        footerLinkText="Back to Login"
        onFooterLinkClick={() => navigate("/login")}
        showGoogleButton={false}
      >
        {userData.image && (
          <div className="flex justify-center mb-4">
            <img
              src={hostGoogleImage(userData.image)}
              alt="Profile"
              className="w-32 h-32 rounded-full border-4 border-blue-100"
            />
          </div>
        )}
        <h2 className="!text-2xl text-center mb-0 capitalize">
          {userData.name}
        </h2>
        <h2 className="!text-xl text-center text-gray-500 !mb-2">
          {userData.email}
        </h2>
        <TextField
          fullWidth
          label={
            <div className="flex items-center gap-2">
              <User className="h-5 w-5 text-gray-400" />
              <span>Username</span>
            </div>
          }
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          className="mb-4"
          placeholder="Choose a username"
        />
        <TextField
          fullWidth
          type="password"
          label={
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-400" />
              <span>Password</span>
            </div>
          }
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          className="mb-4"
          placeholder="Create a password"
        />
        <TextField
          fullWidth
          type="password"
          label={
            <div className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-gray-400" />
              <span>Confirm Password</span>
            </div>
          }
          name="passwordConfirmation"
          value={formData.passwordConfirmation}
          onChange={handleInputChange}
          className="mb-4"
          placeholder="Confirm your password"
        />
      </AuthForm>
    </AuthLayout>
  );
};

export default CompleteSigninGoogle;
