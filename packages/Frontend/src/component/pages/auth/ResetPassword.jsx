import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { toast } from "react-toastify";
import { Button, TextField, Card, CardContent } from "@mui/material";
import { Lock, ArrowLeft, ListTodo } from "lucide-react";
import PasswordStrengthMeter from "./PasswordMeter";
import { motion } from "framer-motion";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirmation) {
      toast.error("Passwords don't match");
      return;
    }

    await resetPassword({ token, password, passwordConfirmation });

    return true;
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
              Reset Password
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <TextField
                fullWidth
                label={
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <span>New Password</span>
                  </div>
                }
                type="password"
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 py-6 border-gray-200 focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
              />

              <TextField
                fullWidth
                label={
                  <div className="flex items-center gap-2">
                    <Lock className="h-5 w-5 text-gray-400" />
                    <span>Confirm Password</span>
                  </div>
                }
                type="password"
                placeholder="Confirm Password"
                value={passwordConfirmation}
                onChange={(e) => setPasswordConfirmation(e.target.value)}
                className="pl-10 py-6 border-gray-200 focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
              />

              {password && <PasswordStrengthMeter password={password} />}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                className="!bg-[#546FFF] hover:!shadow-lg hover:!shadow-[#98ABFF] text-white w-full !py-3 !rounded-xl"
              >
                Reset Password
              </Button>

              <div className="flex justify-center items-center text-center pt-2">
                <a
                  onClick={() => navigate("/login")}
                  className="flex gap-2 items-center text-[#3D53DB]  font-medium cursor-pointer hover:!no-underline"
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

export default ResetPassword;
