import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signUp, logout, forgotPassword , googleAuth, resetPassword ,ContinueSignUpWithGoogle } from "../api/auth"; 
import { useAuthStore } from "../stores/authStore"; 
import { toast } from "react-toastify";
import { Navigate } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const { user, setUser, logout: logoutFromStore } = useAuthStore();
  const queryClient = useQueryClient();

  const navigate = useNavigate();

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
      setUser(data.user); // Corrected from data.user ➔ data.user
      localStorage.setItem("accessToken", data.accessToken);
      useAuthStore.getState().setAccessToken(data.accessToken);
    },
    onError: (error) => {
      console.error("Sign-in error:", handleError(error));
    },
  });

  // Sign-up mutation
  const signUpMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await signUp(userData);
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user); // Corrected from data.user ➔ data.user
      localStorage.setItem("accessToken", data.accessToken);
      useAuthStore.getState().setAccessToken(data.accessToken);
    },
    onError: (error) => {
      console.error("Sign-up error:", handleError(error));
    },
  });

  // Sign-out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      await logout();
    },
    onSuccess: () => {
      logoutFromStore();
      // Clear localStorage properly
      localStorage.clear();
      // Clear sessionStorage
      sessionStorage.clear();
      // Invalidate queries
      queryClient.setQueryData(["user"], null);
    },
    onError: (error) => {
      console.error("Sign-out error:", handleError(error));
    },
  });

  // Forgot password mutation
  const forgotPasswordMutation = useMutation({
    mutationFn: async (email) => {
      const response = await forgotPassword(email);
      return response.data;
    },
    onSuccess: (data) => {
      console.log("Forgot password success:", data);
      toast.success("Password reset instructions have been sent to your email.");
    },
    onError: (error) => {
      console.error("Forgot password error:", handleError(error));
      toast.error(
        handleError(error) || "Error sending reset password email. Please try again."
      );
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: async ({token , password , passwordConfirmation}) => {
      const response = await resetPassword(token, password , passwordConfirmation);
      return response.data;
    },
    onSuccess: () => {
      toast.success("Password reset successful!");
    },
    onError: (error) => {
      console.error("Reset password error:" ,handleError(error));
      toast.error(handleError(error) || "Error resetting password. Please try again.");
    }
  })

  // Google SignIn Mutatuin
  const googleSignInMutation = useMutation({
    mutationFn: async () => {
      await googleAuth();
    },
    onSuccess: () => {
      toast.success("Signed in with Google successfully");
    },
    onError: (error) => {
      console.error("Google sign-in error:", handleError(error));
      toast.error("Google sign-in failed. Please try again.");
    },
  });

  // After
  const continueWithGoogleMutation = useMutation({
    mutationFn: async ({ token, username, password, passwordConfirmation }) => {
      const response = await ContinueSignUpWithGoogle(token, username, password, passwordConfirmation);
      return response;
    },
    onSuccess: (data) => {
      setUser(data.user);
      localStorage.setItem("accessToken", data.accessToken);
      useAuthStore.getState().setAccessToken(data.accessToken);
      toast.success("Account setup complete!");
      navigate("/login")
    }, 
    onError: (error) => {
      console.error("Continue with Google error", handleError(error));
      toast.error("Continue with Google failed. Please try again.");
    }
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
    continueWithGoogle: continueWithGoogleMutation.mutateAsync,
    isLoading:
      signInMutation.isPending || signUpMutation.isPending || signOutMutation.isPending || forgotPasswordMutation.isPending || continueWithGoogleMutation.isPending,

    signInError: signInMutation.error,
    signUpError: signUpMutation.error,
    signOutError: signOutMutation.error,
    forgotPasswordError: forgotPasswordMutation.error,
    resetPasswordError: resetPasswordMutation.error,
    googleSignInError: googleSignInMutation.error,
  };
};
