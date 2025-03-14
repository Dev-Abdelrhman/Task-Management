import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9999/depiV1",
  withCredentials: true, // Allow cookies/session authentication
});

// Attach token to every request if available
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt"); // Consider using HttpOnly cookies for better security
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle API errors globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error?.response?.data || error.message);

    // Ensure the error always has a `message` property
    const errorMessage = error.response?.data?.message || "An unexpected error occurred";

    return Promise.reject({ ...error, message: errorMessage });
  }
);


export const signUp = (userData) => API.post("/users/signup", userData);
export const signIn = (credentials) => API.post("/users/signin", credentials);
export const logout = () => API.get("/users/logout");
