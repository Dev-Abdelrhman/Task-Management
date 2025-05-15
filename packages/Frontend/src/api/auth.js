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
      return Promise.reject(error);
    }

    // Handle 403 Forbidden (permission denied)
    if (
      error.response?.status === 403 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/signin") &&
      !originalRequest.url.includes("/signup")
    ) {
      originalRequest._retry = true;
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

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

export const ContinueSignUpWithGoogle = (token, username, password, passwordConfirmation) =>
  API.post("/continueSignUpWithGoogle", {
    token,
    username,
    password,
    passwordConfirmation,
  });

export default API;
