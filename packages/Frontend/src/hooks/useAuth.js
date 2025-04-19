import { useMutation } from "@tanstack/react-query";
import {
  signIn,
  signUp,
  logout,
  forgotPassword,
  googleAuth,
  resetPassword,
  ContinueSignUpWithGoogle,
  handleGoogleCallback,
  getUser,
} from "../api/auth";
import { useAuthStore } from "../stores/authStore";
import { toast } from "react-toastify";

export const useAuth = () => {
  const { user, setUser, logout: logoutFromStore } = useAuthStore();

  // Common error handler
  const handleError = (error) => {
    return (
      error?.response?.data?.message ||
      "Something went wrong. Please try again."
    );
  };

  // Sign-in mutation
  const signInMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await signIn(credentials);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
    },
    onError: (error) => {
      toast.error(handleError(error) || "Sign-in failed. Please try again.");
    },
  });

  // Sign-up mutation
  const signUpMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await signUp(userData);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
    },
    onError: (error) => {
      toast.error(handleError(error) || "Sign-up failed. Please try again.");
    },
  });

  // Sign-out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      logout();
    },
    onSuccess: () => {
      logoutFromStore();
    },
    onError: (error) => {
      toast.error(handleError(error) || "Sign-out failed. Please try again.");
    },
  });
  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      await forgotPassword(email);
    },
    onSuccess: () => {
      toast.success(
        "Password reset instructions have been sent to your email."
      );
    },
    onError: (error) => {
      console.error("Forgot password error:", handleError(error));
      toast.error(
        handleError(error) ||
          "Error sending reset password email. Please try again."
      );
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password, passwordConfirmation }) => {
      await resetPassword(token, password, passwordConfirmation);
    },
    onSuccess: () => {
      toast.success("Password reset successful!");
    },
    onError: (error) => {
      toast.error(
        handleError(error) || "Error resetting password. Please try again."
      );
    },
  });

  // Google SignIn Mutatuin
  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      await googleAuth();
    },
    onError: (error) => {
      console.error("Google sign-in error:", handleError(error));
      toast.error("Google sign-in failed. Please try again.");
    },
  });

  const handleGoogleCallbackMutation = useMutation({
    mutationFn: async () => {
      await handleGoogleCallback();
      const response = await getUser();
      return response;
    },
    onSuccess: async (data) => {
      console.log("Google callback response:", data);
      setUser(data.user);
    },
    onError: (error) => {
      console.error("Google callback failed:", error);
      toast.error("Google sign-in failed. Please try again.");
    },
  });

  // After
  const continueWithGoogleMutation = useMutation({
    mutationFn: async ({ token, username, password, passwordConfirmation }) => {
      const response = await ContinueSignUpWithGoogle(
        token,
        username,
        password,
        passwordConfirmation
      );
      console.log("Continue with Google response:", response);
      return response;
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Account setup complete!");
    },
    onError: (error) => {
      console.error("Continue with Google error", handleError(error));
      toast.error("Continue with Google failed. Please try again.");
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    forgotPassword: forgotPasswordMutation.mutateAsync,
    resetPassword: resetPasswordMutation.mutateAsync,
    googleSignIn: googleSignInMutation.mutateAsync,
    handleGoogleCallback: handleGoogleCallbackMutation.mutateAsync,
    continueWithGoogle: continueWithGoogleMutation.mutateAsync,
    isLoading:
      signInMutation.isPending ||
      signUpMutation.isPending ||
      signOutMutation.isPending ||
      forgotPasswordMutation.isPending ||
      continueWithGoogleMutation.isPending ||
      handleGoogleCallbackMutation.isPending,

    signInError: signInMutation.error,
    signUpError: signUpMutation.error,
    signOutError: signOutMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    googleSignInError: googleSignInMutation.error,
  };
};
