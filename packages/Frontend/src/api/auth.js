import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9999/depiV1/users",
  withCredentials: true, // Allow cookies/session authentication
});

let refreshPromise = null;

// Request Interceptor
API.interceptors.request.use(
  async (config) => {
    config.withCredentials = true; // Always send cookies
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/signin") &&
      !originalRequest.url.includes("/signup") &&
      !originalRequest.url.includes("/refresh")
    ) {
      originalRequest._retry = true;

      if (!refreshPromise) {
        refreshPromise = API.get("/refresh", { withCredentials: true })
          .catch((refreshError) => {
            console.error("Token refresh failed:", refreshError);
            window.location.href = "/login";
            return Promise.reject(refreshError);
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        await refreshPromise;
        return API(originalRequest); // Retry original request
      } catch (err) {
        return Promise.reject("Session expired, please log in again.");
      }
    }

    return Promise.reject(error);
  }
);


// Auth API Calls
export const getUser = async () => {
  const res = await API.get(
    "google/user",
    { withCredentials: true }
  );
  const { user } = res.data;
  return { user };
};
export const signUp = (userData) => API.post("/signup", userData);
export const signIn = (credentials) =>
  API.post("/signin", credentials, { withCredentials: true });
export const logout = () => {
  API.post("/logout", {}, { withCredentials: true });
};
export const forgotPassword = async (email) => {
  try {
    const response = await API.post("/forgotPassword", { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password API error:", error);
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
    const response = await API.patch(`/resetPassword/${token}`, {
      password,
      passwordConfirmation,
    });
    return response.data;
  } catch (error) {
    console.error("Reset password API error:", error);
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
export const handleGoogleCallback = async () => {
  const response = await axios.get(`${API}/auth/google/callback`, {
    withCredentials: true,
  });
  return response;
};
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
