import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const AuthComponent = () => {
  const { user, isAuthenticated, signIn, signUp, signOut, isLoading, error } = useAuth();
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");

  const handleSignIn = async () => {
    try {
      await signIn({ email, password });
    } catch (error) {
      console.error("Sign-in failed:", error);
    }
  };

  const handleSignUp = async () => {
    try {
      await signUp({ name, username, email, password, passwordConfirmation });
    } catch (error) {
      console.error("Sign-up failed:", error);
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
          <h2>Sign In</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleSignIn} disabled={isLoading}>
            Sign In
          </button>

          <h2>Sign Up</h2>
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
          />
          <button onClick={handleSignUp} disabled={isLoading}>
            Sign Up
          </button>
        </div>
      )}
      {error && <p style={{ color: "red" }}>{error.message}</p>}
    </div>
  );
};

export default AuthComponent;