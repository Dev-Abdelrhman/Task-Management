import axios from "axios";

export const API = axios.create({
  baseURL: "http://localhost:9999/depiV1/users",
  withCredentials: true,
});

// Request Interceptor
API.interceptors.request.use(
  async (config) => {
    config.withCredentials = true;
    return config;
  },
  (error) => Promise.reject(error),
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
  },
);
