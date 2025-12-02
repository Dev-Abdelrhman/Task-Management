import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/auth/useAuth";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import TextField from "@mui/material/TextField";
import AuthLayout from "./AuthLayout";
import AuthForm from "./AuthForm";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [signInData, setSignInData] = useState({ email: "", password: "" });

  const { user, signIn, googleSignIn, isLoading } = useAuth();

  useEffect(() => {
    if (user) {
      navigate("/home", { replace: true });
    }
  }, [user, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignInData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!signInData.email || !signInData.password) {
      toast.error("Please fill in all fields");
      return;
    }
    signIn(signInData);
  };

  const handleGoogleSignIn = () => {
    googleSignIn();
  };

  return (
    <AuthLayout>
      <div className="!h-screen flex !items-center">
        <AuthForm
          title="Login"
          subtitle="Login to your account!"
          onSubmit={handleSubmit}
          submitText="Sign In"
          isLoading={isLoading}
          googleButtonText="Sign In with Google"
          onGoogleClick={handleGoogleSignIn}
          footerText="Don't have an account?"
          footerLinkText="Sign up"
          onFooterLinkClick={() => navigate("/sign-up")}
        >
          <div className="space-y-2">
            <div>
              <TextField
                id="email"
                label={
                  <div className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-400" />
                    <span>Email</span>
                  </div>
                }
                variant="outlined"
                name="email"
                value={signInData.email}
                onChange={handleInputChange}
                type="email"
                placeholder="Email address"
                className="pl-10 py-6 border-gray-200 focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
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
                    <span>Password</span>
                  </div>
                }
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={signInData.password}
                onChange={handleInputChange}
                className="pl-10 py-6 focus:border-[#546FFF] focus:ring-[#546FFF] w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-4 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          <div className="text-center text-sm !text-opacity-65">
            <a
              onClick={() => navigate("/forget-password")}
              className="hover:underline font-medium cursor-pointer hover: !no-underline"
            >
              Forget Password?
            </a>
          </div>
        </AuthForm>
      </div>
    </AuthLayout>
  );
};

export default Login;
