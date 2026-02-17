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
  verifyEmail,
} from "../api/auth.js";
import { useAuthStore } from "../../../stores/authStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { user, setUser, logout: logoutFromStore } = useAuthStore();
  const navigate = useNavigate();

  // Common error handler
  const handleError = (error) => {
    if (error?.response?.status === 429) {
      return "Too many attempts. Please try again later.";
    }
    if (error?.response?.status === 401) {
      return (
        error?.response?.data?.message ||
        "Unauthorized access. Please log in again."
      );
    }
    if (error?.response?.status === 403) {
      return "You don't have permission to perform this action.";
    }
    return (
      error?.response?.data?.message ||
      error?.message ||
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
      toast.success("Successfully signed in!");
    },
    onError: (error) => {
      toast.error(handleError(error));
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
      toast.info("Please verify your email to complete the sign-up process.");
      navigate("/sign-up/continue");
    },
    onError: (error) => {
      toast.error(handleError(error));
    },
  });

  // Verify email mutation
  const verifyEmailMutation = useMutation({
    mutationFn: async (otp) => {
      const response = await verifyEmail(otp);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Email verified successfully!");
      navigate("/home");
    },
    onError: (error) => {
      toast.error(handleError(error));
    },
  });

  // Sign-out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      logoutFromStore();
      toast.success("Successfully signed out!");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(handleError(error));
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      await forgotPassword(email);
    },
    onSuccess: () => {
      toast.success(
        "Password reset instructions have been sent to your email.",
      );
    },
    onError: (error) => {
      toast.error(handleError(error));
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({ token, password, passwordConfirmation }) => {
      await resetPassword(token, password, passwordConfirmation);
    },
    onSuccess: () => {
      toast.success("Password reset successful!");
      navigate("/login");
    },
    onError: (error) => {
      toast.error(handleError(error));
    },
  });

  // Google SignIn Mutation
  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      googleAuth();
    },
    onError: (error) => {
      toast.error(handleError(error));
    },
  });

  const handleGoogleCallbackMutation = useMutation({
    mutationFn: async () => {
      await handleGoogleCallback();
      const userResponse = await getUser();
      return userResponse.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Successfully signed in with Google!");
    },
    onError: (error) => {
      navigate("/login");
      toast.error(handleError(error));
    },
  });

  const continueWithGoogleMutation = useMutation({
    mutationFn: async ({ token, username, password, passwordConfirmation }) => {
      const response = await ContinueSignUpWithGoogle(
        token,
        username,
        password,
        passwordConfirmation,
      );
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user);
      toast.success("Account setup complete!");
    },
    onError: (error) => {
      toast.error(handleError(error));
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    verifyEmail: verifyEmailMutation.mutateAsync,
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
      handleGoogleCallbackMutation.isPending ||
      resetPasswordMutation.isPending ||
      verifyEmailMutation.isPending ||
      googleSignInMutation.isPending,
  };
};
