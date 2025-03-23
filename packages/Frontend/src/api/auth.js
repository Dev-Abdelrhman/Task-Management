import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9999/depiV1",
  withCredentials: true, // Allow cookies/session authentication
});

let refreshPromise = null; // Store refresh request promise

// Attach token and refresh if expired
API.interceptors.request.use(async (config) => {
  let token = localStorage.getItem("accessToken");

  if (token) {
    const isExpired = (() => {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1]));
        return decoded.exp * 1000 < Date.now();
      } catch {
        return true;
      }
    })();

    if (isExpired) {
      if (!refreshPromise) {
        refreshPromise = API.get("/users/refresh", { withCredentials: true })
          .then((res) => {
            localStorage.setItem("accessToken", res.data.accessToken);
            return res.data.accessToken;
          })
          .catch((error) => {
            console.error("Token refresh failed:", error);
            localStorage.removeItem("accessToken");
            window.location.href = "/login";
            return Promise.reject(error);
          })
          .finally(() => {
            refreshPromise = null;
          });
      }

      try {
        token = await refreshPromise;
      } catch (error) {
        // Ensure localStorage is cleared if refresh fails
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject("Session expired, please log in again.");
      }
    }

    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
}, (error) => Promise.reject(error));

// Handle API errors globally
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Avoid redirecting for login/signup errors
    if (
      error.response?.status === 401 &&
      !originalRequest.url.includes("/users/signin") &&
      !originalRequest.url.includes("/users/signup")
    ) {
      localStorage.removeItem("accessToken");
      window.location.href = "/login"; 
    }
    
    return Promise.reject(error);
  }
);

export const debugLocalStorage = () => {
  console.log("Current localStorage state:", {
    accessToken: localStorage.getItem("accessToken")
  });
};

export const clearAuthState = () => {
  localStorage.removeItem("accessToken");
  window.location.href = "/login";
};

// Google Authentication
export const googleAuth = () => {
  window.location.href = "http://localhost:9999/depiV1/users/google";
};

// Auth API Calls
export const signUp = (userData) => API.post("/users/signup", userData);
export const signIn = (credentials) => API.post("/users/signin", credentials, { withCredentials: true });
export const handleGoogleCallback = (code) => {
  return API.get("/users/google/callback", { params: { code } }) // ✅ Correct path
    .then((response) => {
      const { accessToken , user } = response.data;
      localStorage.setItem("accessToken", accessToken);
      return response.data;
    })
    .catch((error) => {
      console.error("Google callback error:", error);
      throw error;
    });
};
export const forgotPassword = async (email) => {
  try {
    const response = await API.post("/users/forgotPassword", { email });
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
export const resetPassword = async (token, password , passwordConfirmation) => {
  try {
    const response = await API.patch(`/users/resetPassword/${token}`, { password , passwordConfirmation })
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
}
// Logout
export const logout = () => {
  return API.post("/users/logout", {}, { withCredentials: true })
    .then(() => {
      localStorage.removeItem("accessToken"); // Clear token on logout
      window.location.href = "/login"; // Redirect user to login
    })
    .catch((error) => {
      console.error("Logout failed:", error);
      return Promise.reject(error);
    });
};

export default API;
