// api for authentication
import axios from "axios"

const API = axios.create({baseURL: "http://localhost:9999/depiV1", 
    withCredentials: true,
})  // create an axios instance for the API

export const signIn = (userData) => API.post("/users/signup", userData)  // sign in a user
export const signUp = (credentials) => API.post("/users/signin", credentials)  // sign up a user
export const logout = () => API.get("/users/logout")  // log out a user
