import { useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth"; 
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const GoogleCallback = () => {
  const {handleGoogleCallback } = useAuth(); 
  const navigate = useNavigate();


  useEffect(() => {
    const processCallback = async () => {
      try {
        await handleGoogleCallback();
        navigate("/home", { replace: true });

      } catch (error) {
        console.error("Google sign-in failed:", error);
        navigate("/login", { replace: true });
      }
    };

    processCallback();
  }, [handleGoogleCallback, navigate]);

  return <div>Signing in...</div>;
};

export default GoogleCallback;