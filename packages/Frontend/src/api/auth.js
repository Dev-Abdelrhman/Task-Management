import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9999/depiV1",
  withCredentials: true, // Allow cookies/session authentication
});

let refreshPromise = null; 

// Attach token and refresh if expired
API.interceptors.request.use(
  async (config) => {
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
  },
  (error) => Promise.reject(error)
);

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

// Auth API Calls
// export const getUser = async () => {
//   const response = await API.get("/users/google/user", {
//     withCredentials: true 
//   });
//   console.log(response);
  
//   return response;
// };
export const signUp = (userData) => API.post("/users/signup", userData);
export const signIn = (credentials) => API.post("/users/signin", credentials, { withCredentials: true });
export const logout = () => {API.post("/users/logout", {}, { withCredentials: true })};
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
export const resetPassword = async (token, password, passwordConfirmation) => {
  try {
    const response = await API.patch(`/users/resetPassword/${token}`, {
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
  window.location.href = `${API.defaults.baseURL}/users/google`;
};

///////////////////////
export const handleGoogleCallback = async () => {
  const response = await axios.get(`${API}/auth/google/callback`, {
    withCredentials: true, 
  });
  console.log(response);
  
  return response;
};

///////////
export const ContinueSignUpWithGoogle = async (token, username, password, passwordConfirmation) => {
  try {
    const response = await API.post("/users/continueSignUpWithGoogle", { token, username, password, passwordConfirmation });
    const { accessToken, user } = response.data;
    localStorage.setItem("accessToken", accessToken);

    return { user, accessToken };
  } catch (error) {

    if (error.response?.status === 401) {
      throw new Error("Session expired. Please restart the signup process.");
    }
    const errorMessage =
      error.response?.data?.message || error.response?.data?.error || "Error completing Google signup";

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
