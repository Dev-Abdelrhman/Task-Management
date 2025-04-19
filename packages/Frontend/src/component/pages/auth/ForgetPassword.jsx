import React, { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { assets } from "../../../assets/assets";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Card, CardContent } from "@mui/material";
import { Mail, ArrowLeft } from "lucide-react";
import { bg } from "../../../assets/assets";

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
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <a href="/" className="absolute top-3 left-3">
        <img src={assets.logo} alt="logo" className="h-12 w-auto" />
      </a>

      <Card className="w-full max-w-md border-0 shadow-xl">
        <CardContent className="space-y-4">
          <h2 className="text-3xl font-bold text-center text-blue-700">
            Forgot Password
          </h2>

          {!isSubmitted ? (
            <>
              <p className="text-gray-600 text-center mb-4">
                Enter your email address and we'll send you a link to reset your
                password
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
                  className="pl-10"
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={isLoading}
                  className="!bg-blue-600 text-white !py-3 !rounded-xl hover:!bg-blue-700"
                >
                  Send Reset Link
                </Button>

                <div className="text-center pt-4">
                  <a
                    onClick={() => navigate("/login")}
                    className="text-blue-600 hover:underline font-medium cursor-pointer flex items-center justify-center gap-1"
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
  );
};

export default ForgetPassword;
