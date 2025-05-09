import React, { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import PasswordStrengthMeter from "./PasswordMeter";
import { User, Mail, Lock } from "lucide-react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { motion } from "framer-motion";

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
  const { user, signUp, googleSignIn } = useAuth();

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

    await signUp(signUpData);
    // console.log(`${action} successful:`, response);
    navigate("/");
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
    <div className="flex h-screen w-full">
      <div className="hidden md:block md:w-1/2 relative overflow-hidden bg-[#1A2793]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A2793] via-[#2A3BB7] to-[#546FFF]"></div>

        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-[10%] left-[20%] w-64 h-64 bg-[#9F84FD]/20 rounded-full blur-xl animate-pulse"></div>
          <div
            className="absolute bottom-[20%] right-[10%] w-80 h-80 bg-[#98ABFF]/20 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
          <div
            className="absolute top-[60%] left-[10%] w-40 h-40 bg-[#546FFF]/30 rounded-full blur-xl animate-pulse"
            style={{ animationDelay: "2s" }}
          ></div>
        </div>

        <div className="absolute top-[15%] right-[15%] w-20 h-20 border-4 border-[#9F84FD]/30 rounded-lg transform rotate-12"></div>
        <div className="absolute bottom-[25%] left-[15%] w-16 h-16 border-4 border-[#98ABFF]/40 rounded-full"></div>
        <div className="absolute top-[70%] right-[25%] w-24 h-24 border-4 border-[#BAC8FF]/20 transform rotate-45"></div>

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col gap-4"
          >
            <div className="max-w-md mx-auto">
              <div className="inline-block px-3 py-1 mb-6 text-sm font-medium text-[#1A2793] bg-[#BAC8FF] rounded-full animate-bounce">
                Welcome to our Task managment application ✨
              </div>

              <h1 className="text-5xl font-bold mb-4 text-white tracking-tight">
                <span className="block">Start your</span>
                <span className="block text-[#98ABFF]">journey with us</span>
              </h1>

              <p className="text-xl text-blue-100 opacity-90 mb-8">
                Sign in to access your personalized projects and continue where
                you left off.
              </p>

              <div className="space-y-4 mt-8">
                <div className="flex items-center">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A2793]/30 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#BAC8FF]"
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
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-[#1A2793]/30 mr-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-[#BAC8FF]"
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
                  <p className="text-blue-100">
                    Advanced security for your data
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full flex items-center justify-center"
        >
          <Card className="w-full max-w-md border-0 !shadow-xl">
            <h2 className="text-3xl font-bold text-center text-[#3D53DB] pt-6">
              Sign-up
            </h2>
            <p className="text-center text-gray-500">Create your account!</p>
            <form onSubmit={(e) => handleSubmit(e, "Sign Up")}>
              <CardContent className="space-y-4">
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
                      onChange={(e) => handleInputChange(e, setSignUpData)}
                      type="text"
                      placeholder="Your Name"
                      className="pl-10 py-6  focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
                      required
                      InputLabelProps={{ required: false }} // <-- this prevents the asterisk
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
                      onChange={(e) => handleInputChange(e, setSignUpData)}
                      type="text"
                      required
                      placeholder="Username"
                      className="pl-10 py-6  focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
                      InputLabelProps={{ required: false }} // <-- this prevents the asterisk
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
                      onChange={(e) => handleInputChange(e, setSignUpData)}
                      className="pl-10 py-6  focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
                      required
                      InputLabelProps={{ required: false }} // <-- this prevents the asterisk
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
                      onChange={(e) => handleInputChange(e, setSignUpData)}
                      className="pl-10 py-6  focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
                      required
                      InputLabelProps={{ required: false }} // <-- this prevents the asterisk
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
                          <span>password Confermation</span>
                        </div>
                      }
                      type="password"
                      placeholder="password Confermation"
                      name="passwordConfirmation" // Match state key spelling
                      value={signUpData.passwordConfirmation}
                      onChange={(e) => handleInputChange(e, setSignUpData)}
                      className="pl-10 py-6  focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
                      required
                      InputLabelProps={{ required: false }} // <-- this prevents the asterisk
                    />
                  </div>
                </div>

                {signUpData.password && (
                  <PasswordStrengthMeter password={signUpData.password} />
                )}

                <Button
                  type="submit"
                  variant="contained"
                  borderRadius="40px"
                  className="!bg-[#546FFF] hover:!shadow-lg hover:!shadow-[#98ABFF] text-white w-full !py-3 !rounded-xl"
                >
                  Sign Up
                </Button>

                <div className="text-center text-sm">
                  <span className="text-gray-500">
                    Do you have an account?{" "}
                  </span>
                  <a
                    onClick={() => navigate("/login")}
                    className="text-[#3D53DB] hover:underline font-medium cursor-pointer hover: !no-underline"
                  >
                    Sign In
                  </a>
                </div>

                <div className="relative my-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-gray-50 px-2 text-gray-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button
                  variant="outlined"
                  onClick={handleGoogleSignIn}
                  type="button"
                  sx={{
                    color: "black",
                  }}
                  className="w-full !py-3 !border !border-gray-300 !hover:bg-gray-50 flex items-center justify-center gap-2 !rounded-xl"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                  >
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                    <path d="M1 1h22v22H1z" fill="none" />
                  </svg>
                  Sign Up with Google
                </Button>
              </CardContent>
            </form>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SignUp;
