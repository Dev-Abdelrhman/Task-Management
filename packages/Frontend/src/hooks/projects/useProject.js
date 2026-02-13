import { useMutation } from "@tanstack/react-query";
import { KickUserFromProject } from "../../api/project";
import { toast } from "react-toastify";

export const useProject = () => {
  const kickMemberMutation = useMutation({
    mutationFn: async ({ userId, projectId, memberId }) => {
      return await KickUserFromProject(userId, projectId, memberId);
    },
    onSuccess: () => {
      toast.success("Member kicked successfully");
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message ||
          "Failed to kick member. Please try again."
      );
    },
  });

  return {
    kickMember: kickMemberMutation.mutate,
    kickMemberAsync: kickMemberMutation.mutateAsync,
    kickUserLoading: kickMemberMutation.isPending,
    kickUserError: kickMemberMutation.error,
  };
};
