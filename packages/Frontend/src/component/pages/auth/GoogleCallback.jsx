import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../../../hooks/useAuth";

const GoogleCallback = () => {
  const location = useLocation();
  const navigate = useNavigate();
  // Assuming useAuth provides a way to set auth data (e.g., token and user)
  const { setAuthData } = useAuth();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const code = queryParams.get("code");

    if (!code) {
      toast.error("Authorization code not found.");
      navigate("/login");
      return;
    }

    const exchangeCodeForToken = async () => {
      try {
        // Call your backend endpoint to exchange the code for an access token.
        const response = await fetch(`http://localhost:5173/depiV1/users/google/callback?code=${code}`, {
          method: "GET",
        });

        if (!response.ok) {
          throw new Error("Failed to exchange code for token");
        }

        const data = await response.json();
        // data should include a "status", "accessToken", and "user"
        if (data.status === "success" && data.accessToken && data.user) {
          // Update the auth context / state with the provided token and user data.
          setAuthData(data);
          toast.success(`Welcome ${data.user.name}!`);
          navigate("/home");
        } else {
          toast.error("Authentication failed, please try again.");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during Google sign in:", error);
        toast.error("Google sign in error: " + error.message);
        navigate("/login");
      }
    };

    exchangeCodeForToken();
  }, [location.search, navigate, setAuthData]);

  return (
    <div className="flex justify-center items-center h-screen">
      <p>Completing Google Sign-In...</p>
    </div>
  );
};

export default GoogleCallback;