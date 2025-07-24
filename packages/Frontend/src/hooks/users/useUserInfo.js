import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  deleteUser,
  removeUserImage,
  updateUserInfo,
  updateUserPassword,
} from "../../api/updateUserData";
import { useAuthStore } from "../../stores/authStore";
import { useNavigate } from "react-router-dom";

export const useUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser } = useAuthStore();

  const handleError = (error) => {
    if (error?.response?.status !== 401 && error?.response?.status !== 403) {
      return error?.response?.data?.message || "Something went wrong";
    }
    return null;
  };

  // Mutations
  const updateUserInfoMutation = useMutation({
    mutationFn: async (userInfo) => {
      await updateUserInfo(userInfo);
    },
    onSuccess: (_, userInfo) => {
      setUser({ ...user, ...userInfo });
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
      await updateUserPassword(passwordData);
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
      await removeUserImage(userID, public_id);
    },
    onSuccess: () => {
      setUser({ ...user, image: [] });
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
      await deleteUser();
    },
    onSuccess: () => {
      queryClient.clear();
      setUser(null);
      navigate("/login");
      toast.success("User deleted successfully");
    },
    onError: (err) => {
      const message = handleError(err);
      if (message) toast.error(`User deletion failed: ${message}`);
    },
  });

  return {
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
