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

export const useUser = () => {
  const queryClient = useQueryClient();

  const handleError = (error) => {
    if (error?.response?.status !== 401 && error?.response?.status !== 403) {
      return error?.response?.data?.message || "Something went wrong";
    }
    return null;
  };

  // Queries
  const useAuthUser = (options = {}) =>
    useQuery({
      queryKey: ["user", "auth"],
      queryFn: getUserInfoForAuth,
      onError: (err) => {
        const message = handleError(err);
        if (message) toast.error(`Auth failed: ${message}`);
      },
      ...options,
    });

  const useProfileUser = (options = {}) =>
    useQuery({
      queryKey: ["user", "profile"],
      queryFn: getUserInfoForProfile,
      onError: (err) => {
        const message = handleError(err);
        if (message) toast.error(`Profile fetch failed: ${message}`);
      },
      ...options,
    });

  // Mutations
  const updateUserInfoMutation = useMutation({
    mutationFn: updateUserInfo,
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "profile"]);
      toast.success("User info updated successfully");
    },
    onError: (err) => {
      const message = handleError(err);
      if (message) toast.error(`Update failed: ${message}`);
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: updateUserPassword,
    onSuccess: () => toast.success("Password updated successfully"),
    onError: (err) => {
      const message = handleError(err);
      if (message) toast.error(`Password update failed: ${message}`);
    },
  });

  const removeImageMutation = useMutation({
    mutationFn: ({ userID, public_id }) => removeUserImage(userID, public_id),
    onSuccess: () => {
      queryClient.invalidateQueries(["user", "profile"]);
      toast.success("Image removed successfully");
    },
    onError: (err) => {
      const message = handleError(err);
      if (message) toast.error(`Image removal failed: ${message}`);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUser,
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
