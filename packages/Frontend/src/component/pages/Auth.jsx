import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const AuthComponent = () => {
  const { user, isAuthenticated, signIn, signUp, signOut, isLoading, signInError, signUpError } = useAuth();
  
  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleInputChange = (e, form) => {
    const { name, value } = e.target;
    if (form === "signIn") {
      setSignInData((prev) => ({ ...prev, [name]: value }));
    } else {
      setSignUpData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSignIn = async () => {
    try {
      await signIn(signInData);
    } catch (error) {
      console.error("Sign-in failed:", error);
    }
  };

  const handleSignUp = async () => {
    if (signUpData.password !== signUpData.passwordConfirmation) {
      alert("Passwords do not match!");
      return;
    }
    try {
      await signUp(signUpData);
    } catch (error) {
      console.error("Sign-up failed:", error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={signOut} disabled={isLoading}>Sign Out</button>
        </div>
      ) : (
        <div>
          <h2>Sign In</h2>
          <input
            type="email"
            name="email"
            placeholder="Email"
            aria-label="Email"
            value={signInData.email}
            onChange={(e) => handleInputChange(e, "signIn")}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            aria-label="Password"
            value={signInData.password}
            onChange={(e) => handleInputChange(e, "signIn")}
          />
          <button onClick={handleSignIn} disabled={isLoading || !signInData.email || !signInData.password}>
            Sign In
          </button>
          {signInError && <p style={{ color: "red" }}>{signInError.message}</p>}

          <h2>Sign Up</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            aria-label="Name"
            value={signUpData.name}
            onChange={(e) => handleInputChange(e, "signUp")}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            aria-label="Username"
            value={signUpData.username}
            onChange={(e) => handleInputChange(e, "signUp")}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            aria-label="Email"
            value={signUpData.email}
            onChange={(e) => handleInputChange(e, "signUp")}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            aria-label="Password"
            value={signUpData.password}
            onChange={(e) => handleInputChange(e, "signUp")}
          />
          <input
            type="password"
            name="passwordConfirmation"
            placeholder="Confirm Password"
            aria-label="Confirm Password"
            value={signUpData.passwordConfirmation}
            onChange={(e) => handleInputChange(e, "signUp")}
          />
          <button
            onClick={handleSignUp}
            disabled={
              isLoading ||
              !signUpData.name ||
              !signUpData.username ||
              !signUpData.email ||
              !signUpData.password ||
              !signUpData.passwordConfirmation
            }
          >
            Sign Up
          </button>
          {signUpError && <p style={{ color: "red" }}>{signUpError.message}</p>}
        </div>
      )}
    </div>
  );
};

export default AuthComponent;
