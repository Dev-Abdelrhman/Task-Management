import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { User, Lock } from "lucide-react";
import { Button, TextField, Card, CardContent } from "@mui/material";
import { jwtDecode } from "jwt-decode";


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

  // Extract token from URL and decode user data
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
        image: decoded.image || decoded.picture,
      });
      setToken(tokenFromURL);
    } catch (error) {
      toast.error("Invalid or expired token. Please restart the process.");
    }
  }, [location.search]);

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

    try {
      const response = await continueWithGoogle({
        token,
        username: formData.username,
        password: formData.password,
        passwordConfirmation: formData.passwordConfirmation,
      });

    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "Failed to complete signup");
    }
  };

  if (!userData) return null;

  return (
    <div className="flex h-screen w-full">
      <div className="hidden md:block md:w-1/2 relative overflow-hidden bg-blue-900">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-blue-700 to-blue-500"></div>

        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-blue-400/20 rounded-full blur-xl animate-pulse"></div>
          <div
            className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-blue-300/20 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-[60%] left-[10%] w-40 h-40 bg-blue-500/30 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="absolute top-[15%] right-[15%] w-20 h-20 border-4 border-blue-400/30 rounded-lg transform rotate-12"></div>
        <div className="absolute bottom-[25%] left-[15%] w-16 h-16 border-4 border-blue-300/40 rounded-full"></div>
        <div className="absolute top-[70%] right-[25%] w-24 h-24 border-4 border-blue-200/20 transform rotate-45"></div>

        <svg
          className="absolute bottom-0 left-0 w-full opacity-20"
          viewBox="0 0 1440 320"
        >
          <path
            fill="#ffffff"
            fillOpacity="1"
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,250.7C960,267,1056,245,1152,224C1248,203,1344,181,1392,170.7L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          ></path>
        </svg>

        <div className="relative flex flex-col justify-center h-full px-12 z-10">
          <div className="max-w-md mx-auto">
            <div className="inline-block px-3 py-1 mb-6 text-sm font-medium text-blue-900 bg-blue-200 rounded-full animate-bounce">
              Welcome to our Task managment application ✨
            </div>

            <h1 className="text-5xl font-bold mb-4 text-white tracking-tight">
              <span className="block">Start your</span>
              <span className="block text-blue-300">journey with us</span>
            </h1>

            <p className="text-xl text-blue-100 opacity-90 mb-8">
              Sign in to access your personalized projects and continue where
              you left off.
            </p>

            <div className="space-y-4 mt-8">
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/30 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-blue-100">
                  Seamless task management across all devices
                </p>
              </div>
              <div className="flex items-center">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-600/30 mr-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-200"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2-2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <p className="text-blue-100">Advanced security for your data</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <Card className="w-full max-w-md border-0 !shadow-xl">
          <h2 className="text-3xl font-bold text-center text-blue-700 pt-6">
            Complete Sign Up
          </h2>
          <p className="text-center text-gray-500">
            Finish setting up your account
          </p>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {userData.image && (
                <div className="flex justify-center mb-4">
                  <img
                    src={userData.image.replace("=s96-c", "=s200-c")}
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

              {/* Editable Fields */}
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                className="!bg-blue-600 !text-white !py-3 !rounded-xl hover:!bg-blue-700 transition-colors"
              >
                {isLoading ? "Completing..." : "Complete Sign Up"}
              </Button>

              <div className="text-center pt-4">
                <Button
                  onClick={() => navigate("/login")}
                  className="!text-blue-600 hover:!underline !normal-case"
                >
                  Back to Login
                </Button>
              </div>
            </CardContent>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default CompleteSigninGoogle;
