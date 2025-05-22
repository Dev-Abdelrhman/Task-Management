import React, { useState } from "react";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Card, CardContent } from "@mui/material";
import { Mail, ArrowLeft, ListTodo } from "lucide-react";

const ForgetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { forgotPassword, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    await forgotPassword(email);
    setIsSubmitted(true);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="!fixed !top-0 !z-50 w-full border-b !bg-white/80 !backdrop-blur-sm">
        <div className="container flex h-16 !items-center justify-between">
          <div className="flex !items-center gap-5">
            <div className="flex !items-center  gap-2">
              <ListTodo className="h-6 w-6 text-[#3D53DB]" />
              <span className="!text-2xl !font-bold text-[#3D53DB]">
                TaskFlow
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              onClick={() => navigate("/login")}
              variant="outline"
              className="border-[#3D53DB] text-[#546FFF] hover:bg-blue-50 !px-5 !py-3 !rounded-full "
            >
              Sign In
            </Button>
            <Button
              className="!bg-[#546FFF] !text-white hover:!shadow-lg hover:!shadow-[#98ABFF] !px-7 !py-3 !rounded-full"
              onClick={() => navigate("/sign-up")}
            >
              Sign Up
            </Button>
          </div>
        </div>
      </header>

      <div className="w-full md:w-full flex items-center justify-center p-6 bg-blue-50 min-h-screen ">
        <Card className="w-full max-w-md border-0 !shadow-lg">
          <CardContent className="space-y-4">
            <h2 className="text-3xl font-bold text-center text-[#3D53DB]">
              Forgot Password
            </h2>

            {!isSubmitted ? (
              <>
                <p className="text-gray-600 text-center mb-4">
                  Enter your email address and we'll send you a link to reset
                  your password
                </p>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <TextField
                    fullWidth
                    label={
                      <div className="flex items-center gap-2">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <span>Email Address</span>
                      </div>
                    }
                    type="email"
                    placeholder="name@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 py-6 border-gray-200 focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={isLoading}
                    className="!bg-[#546FFF] hover:!shadow-lg hover:!shadow-[#98ABFF] text-white w-full !py-3 !rounded-xl"
                  >
                    Send Reset Link
                  </Button>

                  <div className=" flex justify-center items-center text-center pt-2">
                    <a
                      onClick={() => navigate("/login")}
                      className="flex gap-2  items-center text-[#3D53DB] hover:underline font-medium cursor-pointer hover: !no-underline"
                    >
                      <ArrowLeft className="h-4 w-4" />
                      Return to login
                    </a>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center p-6">
                <p className="text-gray-600 mb-4">
                  A reset link has been sent to your email {email}. Please check
                  your inbox - you'll receive a password reset link shortly.
                </p>
                <Button
                  onClick={() => navigate("/login")}
                  variant="outlined"
                  className="w-full !border-gray-300 !text-gray-700 hover:!bg-gray-50"
                >
                  Back to Login
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgetPassword;
