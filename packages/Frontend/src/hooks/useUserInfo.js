import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  deleteUser,
  getUserInfoForAuth,
  getUserInfoForProfile,
  removeUserImage,
  updateUserInfo,
  updateUserPassword,
} from "../api/updateUserData";
import { useAuthStore } from "../stores/authStore";

export const useUser = () => {
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  const handleError = (error) => {
    if (error?.response?.status !== 401 && error?.response?.status !== 403) {
      return error?.response?.data?.message || "Something went wrong";
    }
    return null;
  };

  // Helper function to extract and flatten user data from API response
  const extractUserData = (response) => {
    // If response has .data property, use that, otherwise use response directly
    const responseData = response.data || response;
    // If the data has a .user property, use that, otherwise use the data directly
    return responseData.user || responseData;
  };

  // Queries
  const useAuthUser = (options = {}) =>
    useQuery({
      queryKey: ["user", "auth"],
      queryFn: async () => {
        const response = await getUserInfoForAuth();
        return extractUserData(response);
      },
      onSuccess: (data) => {
        setUser(data);
      },
      onError: (err) => {
        const message = handleError(err);
        if (message) toast.error(`Auth failed: ${message}`);
      },
      ...options,
    });

  const useProfileUser = (options = {}) =>
    useQuery({
      queryKey: ["user", "profile"],
      queryFn: async () => {
        const response = await getUserInfoForProfile();
        return extractUserData(response);
      },
      onSuccess: (data) => {
        setUser(data);
      },
      onError: (err) => {
        const message = handleError(err);
        if (message) toast.error(`Profile fetch failed: ${message}`);
      },
      ...options,
    });

  // Mutations
  const updateUserInfoMutation = useMutation({
    mutationFn: async (userInfo) => {
      const response = await updateUserInfo(userInfo);
      return extractUserData(response);
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries(["user", "profile"]);
      toast.success("User info updated successfully");
    },
    onError: (err) => {
      const message = handleError(err);
      if (message) toast.error(`Update failed: ${message}`);
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: async (passwordData) => {
      const response = await updateUserPassword(passwordData);
      return extractUserData(response);
    },
    onSuccess: () => {
      toast.success("Password updated successfully");
    },
    onError: (err) => {
      const message = handleError(err);
      if (message) toast.error(`Password update failed: ${message}`);
    },
  });

  const removeImageMutation = useMutation({
    mutationFn: async ({ userID, public_id }) => {
      const response = await removeUserImage(userID, public_id);
      return extractUserData(response);
    },
    onSuccess: (data) => {
      setUser(data);
      queryClient.invalidateQueries(["user", "profile"]);
      toast.success("Image removed successfully");
    },
    onError: (err) => {
      const message = handleError(err);
      if (message) toast.error(`Image removal failed: ${message}`);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: async () => {
      const response = await deleteUser();
      return extractUserData(response);
    },
    onSuccess: () => {
      queryClient.clear();
      toast.success("User deleted successfully");
    },
    onError: (err) => {
      const message = handleError(err);
      if (message) toast.error(`User deletion failed: ${message}`);
    },
  });

  return {
    // Queries
    useAuthUser,
    useProfileUser,

    // Mutations
    updateUser: updateUserInfoMutation.mutateAsync,
    updatePassword: updatePasswordMutation.mutateAsync,
    removeImage: removeImageMutation.mutateAsync,
    deleteUser: deleteUserMutation.mutateAsync,

    // Loading states
    isUpdating: updateUserInfoMutation.isLoading,
    isChangingPassword: updatePasswordMutation.isLoading,
    isRemovingImage: removeImageMutation.isLoading,
    isDeleting: deleteUserMutation.isLoading,

    // Statuses
    updateUserStatus: updateUserInfoMutation.status,
    updatePasswordStatus: updatePasswordMutation.status,
    removeImageStatus: removeImageMutation.status,
    deleteUserStatus: deleteUserMutation.status,
  };
};
