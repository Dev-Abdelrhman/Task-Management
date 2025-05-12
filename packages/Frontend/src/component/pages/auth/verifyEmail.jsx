import React, { useState, useRef } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Button, Card, CardContent } from "@mui/material";
import { Mail, ArrowLeft, ListTodo } from "lucide-react";

const VerifyEmail = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);
  const { verifyEmail } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e, idx) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value.length === 1 && idx < 5) {
      inputRefs.current[idx + 1].focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace") {
      if (otp[idx]) {
        const newOtp = [...otp];
        newOtp[idx] = "";
        setOtp(newOtp);
      } else if (idx > 0) {
        inputRefs.current[idx - 1].focus();
      }
    }
  };

  const handlePaste = (e) => {
    const paste = e.clipboardData.getData("text").replace(/\D/g, "");
    if (paste.length === 6) {
      setOtp(paste.split(""));
      inputRefs.current[5].focus();
    }
    e.preventDefault();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      toast.error("Please enter the 6-digit OTP.");
      return;
    }
    try {
      await verifyEmail(code);
      toast.success("Email verified!");
      navigate("/home");
    } catch (err) {
      // Error handled in useAuth
    }
  };

  const handleResend = () => {
    toast.info("Resend OTP logic goes here.");
    // Implement resend logic as needed
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <header className="!fixed !top-0 !z-50 w-full border-b !bg-white/80 !backdrop-blur-sm">
        <div className="container flex h-16 !items-center justify-between">
          <div className="flex !items-center gap-5">
            <div className="flex !items-center gap-2">
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
              className="border-[#3D53DB] text-[#546FFF] hover:bg-blue-50 !px-5 !py-3 !rounded-full"
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

      <div className="w-full md:w-full flex items-center justify-center p-6 bg-blue-50 min-h-screen">
        <Card className="w-full max-w-md border-0 !shadow-lg">
          <CardContent className="space-y-4">
            <h2 className="text-3xl font-bold text-center text-[#3D53DB]">
              Email Verification
            </h2>
            <p className="text-gray-600 text-center mb-4">
              Enter the 6-digit code sent to your email address.
            </p>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div
                className="flex justify-center gap-2 mb-2"
                onPaste={handlePaste}
              >
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, idx)}
                    onKeyDown={(e) => handleKeyDown(e, idx)}
                    ref={(el) => (inputRefs.current[idx] = el)}
                    className="w-10 h-12 text-2xl text-center border rounded focus:border-[#546FFF] focus:ring-[#546FFF] transition"
                    autoFocus={idx === 0}
                  />
                ))}
              </div>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="!bg-[#546FFF] hover:!shadow-lg hover:!shadow-[#98ABFF] text-white w-full !py-3 !rounded-xl"
              >
                Verify Email
              </Button>
              <Button
                type="button"
                onClick={handleResend}
                fullWidth
                variant="outlined"
                className="w-full !border-gray-300 !text-gray-700 hover:!bg-gray-50"
              >
                Resend OTP
              </Button>
              <div className="flex justify-center items-center text-center pt-2">
                <a
                  onClick={() => navigate("/login")}
                  className="flex gap-2 items-center text-[#3D53DB] font-medium cursor-pointer hover:!no-underline"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Return to login
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VerifyEmail;
