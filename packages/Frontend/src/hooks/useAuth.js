import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signUp, logout } from "../api/auth";
import { useAuthStore } from "../stores/authStore";

export const useAuth = () => {
  const { user, setUser, logout: logoutFromStore } = useAuthStore();
  const queryClient = useQueryClient();

  const signInMutation = useMutation(signIn, {
    onSuccess: ({ user }) => setUser(user),
    onError: (error) => console.error("Sign-in error:", error),
  });

  const signUpMutation = useMutation(signUp, {
    onSuccess: ({ user }) => setUser(user),
    onError: (error) => console.error("Sign-up error:", error),
  });

  const signOutMutation = useMutation(logout, {
    onSuccess: () => {
      logoutFromStore();
      queryClient.invalidateQueries(["user"]);
    },
    onError: (error) => console.error("Sign-out error:", error),
  });

  return {
    user,
    isAuthenticated: !!user,
    signIn: signInMutation.mutateAsync,
    signUp: signUpMutation.mutateAsync,
    signOut: signOutMutation.mutateAsync,
    isLoading: signInMutation.isPending || signUpMutation.isPending || signOutMutation.isPending,
    error: signInMutation.error || signUpMutation.error || signOutMutation.error,
  };
};
