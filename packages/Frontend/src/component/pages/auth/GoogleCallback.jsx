import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../stores/authStore";

const GoogleCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const accessToken = searchParams.get("accessToken");
  const token = searchParams.get("token");
  const error = searchParams.get("error");

  useEffect(() => {
    if (accessToken) {
      localStorage.setItem("accessToken", accessToken);
      useAuthStore.getState().setAccessToken(accessToken);
      navigate("/home");
    } else if (token) {
      navigate(`/google-signup?token=${token}`);
    } else if (error) {
      toast.error("Google sign-in failed");
      navigate("/login");
    }
  }, [accessToken, token, error, navigate]);

  return <div>Processing...</div>;
};

export default GoogleCallback;
