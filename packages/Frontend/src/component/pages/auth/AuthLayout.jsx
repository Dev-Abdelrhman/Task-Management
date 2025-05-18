import React from "react";
import { motion } from "framer-motion";
import { ListTodo } from "lucide-react";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";

const AuthLayout = ({ children, title, subtitle }) => {
  const navigate = useNavigate();

  return (
    <div className="flex h-screen w-full">
      {/* Left side - Decorative background */}
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

      {/* Right side - Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gray-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="w-full flex items-center justify-center"
        >
          <div className="w-full max-w-md">
            {children}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthLayout; 