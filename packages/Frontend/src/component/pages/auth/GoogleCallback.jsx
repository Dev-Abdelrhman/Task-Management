import React, { useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";

const GoogleCallback = () => {
  const { handleGoogleCallback } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code"); // Get the code from URL

  const handleCallback = async () => {
    try {
      await handleGoogleCallback(code); // Pass code to the callback function
      navigate("/");
    } catch (error) {
      console.error("Google callback failed:", error);
      toast.error("Google sign-in failed. Please try again.");
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