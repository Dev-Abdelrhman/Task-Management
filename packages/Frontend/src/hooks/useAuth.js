import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signUp, logout } from "../api/auth"; // API functions
import { useAuthStore } from "../stores/authStore"; // Zustand store

export const useAuth = () => {
  const { user, setUser, logout: logoutFromStore } = useAuthStore();
  const queryClient = useQueryClient();

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
      localStorage.setItem("accessToken", data.accessToken); // ✅ Key must be "accessToken"
      localStorage.setItem("user", data);
      console.log(data.data.user.username);
      
      useAuthStore.getState().setAccessToken(data.accessToken); // Add this line
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
      setUser(data.user);
      localStorage.setItem("accessToken", data.accessToken); // ✅ Key must be "accessToken"
      useAuthStore.getState().setAccessToken(data.accessToken); // Add this line
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
      localStorage.removeItem("accessToken");
      sessionStorage.clear(); 
      queryClient.setQueryData(["user"], null); // Ensure user is set to null
    },
    
    onError: (error) => {
      console.error("Sign-out error:", handleError(error));
    },
  });

  return {
    user,
    isAuthenticated: !!user,
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isLoading:
      signInMutation.isPending || signUpMutation.isPending || signOutMutation.isPending,
    signInError: signInMutation.error,
    signUpError: signUpMutation.error,
    signOutError: signOutMutation.error,
  };
};
