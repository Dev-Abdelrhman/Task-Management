import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9999/depiV1",
  withCredentials: true, // Allow cookies/session authentication
});

// Attach token to every request if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // Attach token to headers
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle API errors globally
API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response.status === 401) {
      try {
        const res = await API.get("/users/refresh", { withCredentials: true });
        localStorage.setItem("accessToken", res.data.accessToken);
        
        error.config.headers.Authorization = `Bearer ${res.data.accessToken}`;
        return API.request(error.config); // Retry failed request
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return Promise.reject(refreshError); // Logout user if refresh fails
      }
    }

    console.error("API Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Add these to auth.js exports
export const googleAuth = () => {
  window.location.href = "http://localhost:9999/depiV1/users/google";
};


// Auth API Calls
export const signUp = (userData) => API.post("/users/signup", userData);
export const signIn = (credentials) => API.post("/users/signin", credentials, { withCredentials: true });
export const handleGoogleCallback = () => API.get("/users/google/callback");
export const logout = () => {
  const token = localStorage.getItem("accessToken");
  if (!token) {
    return Promise.reject("No token found"); // Handle missing token early
  }
  return API.post(
    "/users/logout",
    {},
    {
      withCredentials: true,
      headers: { Authorization: `Bearer ${token}` }, // Attach token
    }
  );
};