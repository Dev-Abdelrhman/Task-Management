import React, { useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../stores/authStore";

const GoogleCallback = () => {
  const { handleGoogleCallback } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  const { setUser, setAccessToken } = useAuthStore();

  const handleCallback = async () => {
    try {
      const response = await handleGoogleCallback(code);
      
      // Check if the response is valid
      if (!response) {
        throw new Error("Invalid authentication response");
      }

      // Ensure response contains both token and user data
      if (response?.accessToken && response?.user) {
        setUser(response.user);
        setAccessToken(response.accessToken);
        localStorage.setItem("accessToken", response.accessToken);
        // Force redirect to home page
        navigate("/home", { replace: true });
      } else {
        throw new Error("Incomplete authentication data");
      }
    } catch (error) {
      console.error("Google callback failed:", error);
      toast.error("Google sign-in failed. Please try again.");
      // Redirect to login if authentication fails
      navigate("/login");
    }
  };

  useEffect(() => {
    handleCallback();
  }, []);

  return (
    <div className="text-center">
      <h2 className="text-2xl font-bold mb-4">Processing Google Sign-In</h2>
      <p className="text-gray-600">Please wait...</p>
    </div>
  );
};

export default GoogleCallback;