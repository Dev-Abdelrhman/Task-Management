import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9999/depiV1/users",
  withCredentials: true,
});

// Request Interceptor
API.interceptors.request.use(
  async (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalRequest = error.config;

    // Handle 401 Unauthorized (session expired)
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/signin") &&
      !originalRequest.url.includes("/signup")
    ) {
      originalRequest._retry = true;
      localStorage.removeItem("user");
      window.location.href = "/login";
      return Promise.reject("Session expired, please log in again.");
    }

    // Handle 403 Forbidden (permission denied)
    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/signin") &&
      !originalRequest.url.includes("/signup")
    ) {
      originalRequest._retry = true;
      // Instead of logging out, just reject with a permission error
      return Promise.reject("You don't have permission to perform this action");
    }

    return Promise.reject(error);
  }
);

// Auth API Calls
export const getUser = async () => {
  const res = await API.get("google/user");
  const { user } = res.data;
  return { user };
};
export const signUp = (userData) => API.post("/signup", userData);
export const vrifyEmail = async (otp) => API.post("/verifyotp", { otp }); // Verify email
export const signIn = (credentials) => API.post("/signin", credentials);
export const logout = () => API.post("/logout");
export const forgotPassword = async (email) => {
  try {
    await API.post("/forgotPassword", { email });
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("No user found with this email address.");
    }
    throw new Error(
      error.response?.data?.message || "Error sending reset password email."
    );
  }
};
export const resetPassword = async (token, password, passwordConfirmation) => {
  try {
    await API.patch(`/resetPassword/${token}`, {
      password,
      passwordConfirmation,
    });
  } catch (error) {
    if (error.response?.status === 404) {
      throw new Error("Invalid token or password.");
    }
    throw new Error(
      error.response?.data?.message || "Error resetting password."
    );
  }
};
// Google Authentication
export const googleAuth = async () => {
  window.location.href = `${API.defaults.baseURL}/google`;
};
export const handleGoogleCallback = async () =>
  await axios.get(`${API}/auth/google/callback`);
export const ContinueSignUpWithGoogle = async (
  token,
  username,
  password,
  passwordConfirmation
) => {
  try {
    const response = await API.post("/continueSignUpWithGoogle", {
      token,
      username,
      password,
      passwordConfirmation,
    });
    const { user } = response.data;

    return { user };
  } catch (error) {
    if (error.response?.status === 401) {
      throw new Error("Session expired. Please restart the signup process.");
    }
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      "Error completing Google signup";

    if (error.response?.status === 400) {
      throw new Error(errorMessage);
    }
    if (error.response?.status === 401) {
      throw new Error("Session expired - please restart the signup process");
    }
    throw new Error(errorMessage);
  }
};

export default API;
