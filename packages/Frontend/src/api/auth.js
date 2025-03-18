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
    // Check if token is expired
    const isExpired = (() => {
      try {
        const decoded = JSON.parse(atob(token.split(".")[1])); // Decode JWT
        return decoded.exp * 1000 < Date.now(); // Compare expiration time
      } catch {
        return true; // Assume expired if decoding fails
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
            window.location.href = "/login"; // Redirect to login
            return Promise.reject(error);
          })
          .finally(() => {
            refreshPromise = null; // Reset promise after completion
          });
      }

      try {
        token = await refreshPromise;
      } catch {
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
// Google Authentication
export const googleAuth = () => {
  window.location.href = "http://localhost:9999/depiV1/users/google";
};

// Auth API Calls
export const signUp = (userData) => API.post("/users/signup", userData);
export const signIn = (credentials) => API.post("/users/signin", credentials, { withCredentials: true });
export const forgotPassword = (email) => API.post("/users/forgot-password", email);
export const handleGoogleCallback = () => API.get("/users/google/callback");


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
