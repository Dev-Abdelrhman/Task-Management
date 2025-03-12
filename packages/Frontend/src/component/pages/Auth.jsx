import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const AuthComponent = () => {
  const {
    user,
    isAuthenticated,
    signIn,
    signUp,
    signOut,
    isLoading,
    signInError,
    signUpError,
  } = useAuth();

  const [signInData, setSignInData] = useState({ email: "", password: "" });
  const [signUpData, setSignUpData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });

  const handleInputChange = (e, formSetter) => {
    const { name, value } = e.target;
    formSetter((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e, action) => {
    e.preventDefault();

    if (
      action === "signUp" &&
      signUpData.password !== signUpData.passwordConfirmation
    ) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const response =
        action === "signIn"
          ? await signIn(signInData)
          : await signUp(signUpData);
      console.log(`${action} successful:`, response);
      alert(`${action} successful!`);
    } catch (error) {
      console.error(`${action} failed:`, error);
    }
  };

  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user.name}!</p>
          <button onClick={signOut} disabled={isLoading}>
            Sign Out
          </button>
        </div>
      ) : (
        <div>
          {/* Sign In Form */}
          <h2>Sign In</h2>
          <form onSubmit={(e) => handleSubmit(e, "signIn")}>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signInData.email}
              onChange={(e) => handleInputChange(e, setSignInData)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signInData.password}
              onChange={(e) => handleInputChange(e, setSignInData)}
              required
            />
            <button type="submit" disabled={isLoading}>
              Sign In
            </button>
          </form>
          {signInError && <p style={{ color: "red" }}>{signInError.message}</p>}

          {/* Sign Up Form */}
          <h2>Sign Up</h2>
          <form onSubmit={(e) => handleSubmit(e, "signUp")}>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={signUpData.name}
              onChange={(e) => handleInputChange(e, setSignUpData)}
              required
            />
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={signUpData.username}
              onChange={(e) => handleInputChange(e, setSignUpData)}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signUpData.email}
              onChange={(e) => handleInputChange(e, setSignUpData)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signUpData.password}
              onChange={(e) => handleInputChange(e, setSignUpData)}
              required
            />
            <input
              type="password"
              name="passwordConfirmation"
              placeholder="Confirm Password"
              value={signUpData.passwordConfirmation}
              onChange={(e) => handleInputChange(e, setSignUpData)}
              required
            />
            <button type="submit" disabled={isLoading}>
              Sign Up
            </button>
          </form>
          {signUpError && <p style={{ color: "red" }}>{signUpError.message}</p>}
        </div>
      )}
    </div>
  );
};

export default AuthComponent;
