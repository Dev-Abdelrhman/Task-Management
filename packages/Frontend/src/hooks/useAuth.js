import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signUp, logout } from "../api/auth"; // Your API functions
import { useAuthStore } from "../stores/authStore"; // Zustand store

export const useAuth = () => {
  const { user, setUser, logout: logoutFromStore } = useAuthStore();
  const queryClient = useQueryClient();

  // Sign-in mutation
  const signInMutation = useMutation({
    mutationFn: async (credentials) => {
      const response = await signIn(credentials); // Use the signIn API function
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user); // Update Zustand store with user data
    },
    onError: (error) => {
      console.error("Sign-in error:", error);
      throw error; // Re-throw the error for handling in the component
    },
  });

  // Sign-up mutation
  const signUpMutation = useMutation({
    mutationFn: async (userData) => {
      const response = await signUp(userData); // Use the signUp API function
      return response.data;
    },
    onSuccess: (data) => {
      setUser(data.user); // Update Zustand store with user data
    },
    onError: (error) => {
      console.error("Sign-up error:", error);
      throw error; // Re-throw the error for handling in the component
    },
  });

  // Sign-out mutation
  const signOutMutation = useMutation({
    mutationFn: async () => {
      await logout(); // Use the logout API function
    },
    onSuccess: () => {
      logoutFromStore(); // Clear Zustand store
      queryClient.clear(); // Clear React Query cache
    },
    onError: (error) => {
      console.error("Sign-out error:", error);
      throw error; // Re-throw the error for handling in the component
    },
  });

  return {
    user,
    isAuthenticated: !!user, // Helper to check if the user is authenticated
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isLoading:
      signInMutation.isPending || signUpMutation.isPending || signOutMutation.isPending,
    error: signInMutation.error || signUpMutation.error || signOutMutation.error,
  };
};