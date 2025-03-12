import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const AuthComponent = () => {
  const { user, isAuthenticated, signIn, signUp, signOut, isLoading, error } = useAuth();

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
    form === "signIn"
      ? setSignInData((prev) => ({ ...prev, [name]: value }))
      : setSignUpData((prev) => ({ ...prev, [name]: value }));
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
            value={signInData.email}
            onChange={(e) => handleInputChange(e, "signIn")}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={signInData.password}
            onChange={(e) => handleInputChange(e, "signIn")}
          />
          <button onClick={handleSignIn} disabled={isLoading || signInData.password.length < 6}>Sign In</button>
          {error && <p style={{ color: "red" }}>{error.message}</p>}

          <h2>Sign Up</h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={signUpData.name}
            onChange={(e) => handleInputChange(e, "signUp")}
          />
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={signUpData.username}
            onChange={(e) => handleInputChange(e, "signUp")}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signUpData.email}
            onChange={(e) => handleInputChange(e, "signUp")}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={signUpData.password}
            onChange={(e) => handleInputChange(e, "signUp")}
          />
          <input
            type="password"
            name="passwordConfirmation"
            placeholder="Confirm Password"
            value={signUpData.passwordConfirmation}
            onChange={(e) => handleInputChange(e, "signUp")}
          />
          <button onClick={handleSignUp} disabled={isLoading || signUpData.password.length < 6}>Sign Up</button>
        </div>
      )}
    </div>
  );
};

export default AuthComponent;
