import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllSenderInvite,
  getAllReceiverInvite,
  searchForUser,
  deleteInvite,
  declineInvite,
  acceptInvite,
  sendInvite,
} from "../api/invite";
import { toast } from "react-toastify";

export const useInvite = () => {
  const queryClient = useQueryClient();

  const handleError = (error) => {
    if (error?.response?.status !== 401 && error?.response?.status !== 403) {
      return error?.response?.data?.message || "Something went wrong";
    }
    return null;
  };

  // Query hooks
  const useSenderInvites = (userId, options = {}) => {
    return useQuery({
      queryKey: ["invites", "sender", userId],
      queryFn: () => getAllSenderInvite(userId),
      onError: (err) => {
        const message = handleError(err);
        if (message) toast.error(`Failed to get sender invites: ${message}`);
      },
      ...options,
    });
  };

  const useReceiverInvites = (userId, options = {}) => {
    return useQuery({
      queryKey: ["invites", "receiver", userId],
      queryFn: () => getAllReceiverInvite(userId),
      onError: (err) => {
        const message = handleError(err);
        if (message) toast.error(`Failed to get receiver invites: ${message}`);
      },
      ...options,
    });
  };

  // Mutation hooks
  const searchUserMutation = useMutation({
    mutationFn: ({ userId, username }) => searchForUser(userId, username),
    onError: (err) => {
      const message = handleError(err);
      if (message) toast.error(`User search failed: ${message}`);
    },
  });

  const sendInviteMutation = useMutation({
    mutationFn: ({ userId, projectId, inviteData }) =>
      sendInvite(userId, projectId, inviteData),
    onSuccess: () => {
      queryClient.invalidateQueries(["invites", "sender"]);
      toast.success("Invite sent successfully!");
    },
    onError: (err) => {
      const message = handleError(err);
      if (message) toast.error(`Failed to send invite: ${message}`);
    },
  });

  const deleteInviteMutation = useMutation({
    mutationFn: ({ userId, inviteId }) => deleteInvite(userId, inviteId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(["invites", "sender", userId]);
      toast.success("Invite deleted successfully!");
    },
    onError: (err) => {
      const message = handleError(err);
      if (message) toast.error(`Deletion failed: ${message}`);
    },
  });

  const acceptInviteMutation = useMutation({
    mutationFn: ({ userId, inviteId }) => acceptInvite(userId, inviteId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(["invites", "receiver", userId]);
      toast.success("Invite accepted!");
    },
    onError: (err) => {
      const message = handleError(err);
      if (message) toast.error(`Accept failed: ${message}`);
    },
  });

  const declineInviteMutation = useMutation({
    mutationFn: ({ userId, inviteId }) => declineInvite(userId, inviteId),
    onSuccess: (_, { userId }) => {
      queryClient.invalidateQueries(["invites", "receiver", userId]);
      toast.success("Invite declined!");
    },
    onError: (err) => {
      const message = handleError(err);
      if (message) toast.error(`Decline failed: ${message}`);
    },
  });

  return {
    // Queries
    useSenderInvites,
    useReceiverInvites,

    // Mutations
    searchUser: searchUserMutation.mutateAsync,
    sendInvite: sendInviteMutation.mutateAsync,
    deleteInvite: deleteInviteMutation.mutateAsync,
    acceptInvite: acceptInviteMutation.mutateAsync,
    declineInvite: declineInviteMutation.mutateAsync,

    // Loading states
    isSearching: searchUserMutation.isLoading,
    isSending: sendInviteMutation.isLoading,
    isDeleting: deleteInviteMutation.isLoading,
    isAccepting: acceptInviteMutation.isLoading,
    isDeclining: declineInviteMutation.isLoading,

    // Status access
    searchUserStatus: searchUserMutation.status,
    sendInviteStatus: sendInviteMutation.status,
    deleteInviteStatus: deleteInviteMutation.status,
    acceptInviteStatus: acceptInviteMutation.status,
    declineInviteStatus: declineInviteMutation.status,
  };
};
