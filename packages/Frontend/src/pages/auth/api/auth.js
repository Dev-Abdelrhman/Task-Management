import axios from "axios";
import { API } from "@/api/api";

// Auth API Calls
export const getUser = () => API.get("google/user");
export const signUp = (userData) => API.post("/signup", userData);
export const verifyEmail = (otp) => API.post("/verifyotp", { otp });
export const signIn = (credentials) => API.post("/signin", credentials);
export const logout = () => API.post("/logout");
export const forgotPassword = (email) => API.post("/forgotPassword", { email });
export const resetPassword = (token, password, passwordConfirmation) =>
  API.patch(`/resetPassword/${token}`, {
    password,
    passwordConfirmation,
  });

// Google Authentication
export const googleAuth = () => {
  window.location.href = `${API.defaults.baseURL}/google`;
};

export const handleGoogleCallback = () =>
  axios.get(`${API}/auth/google/callback`);

export const ContinueSignUpWithGoogle = (
  token,
  username,
  password,
  passwordConfirmation,
) =>
  API.post("/continueSignUpWithGoogle", {
    token,
    username,
    password,
    passwordConfirmation,
  });
