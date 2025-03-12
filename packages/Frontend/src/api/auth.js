// api for authentication
import axios from "axios";

const API = axios.create({
  baseURL:"http://localhost:9999/depiV1",
  withCredentials: true,
});

export const signUp = (userData) => API.post("/users/signup", userData); // Sign up a user
export const signIn = (credentials) => API.post("/users/signin", credentials); // Sign in a user
export const logout = () => API.get("/users/logout"); // Log out a user