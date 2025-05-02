import { useMutation } from "@tanstack/react-query";
import { getUserProjects } from "../api/project";
import { toast } from "react-toastify";
import { useProjecthStore } from "../stores/projectStore";
import { daleteProjectImage } from "../api/project";

export const useProject = () => {
  const getPorjectMutation = useMutation({
    mutationFn: async (user_id) => {
      const response = await getUserProjects(user_id);
      console.log(response);
      return response;
    },
    onSuccess: (data) => {
      setProject(data);
    },
    onError: (error) => {
      console.error("Sign-up error:", handleError(error));
    },
  });

  const deleteImageMutation = useMutation({
    mutationFn: async () => {
      daleteProjectImage();
    },
  });

  return {
    projects: getPorjectMutation.mutateAsync,
    deleteImage: deleteImageMutation.mutateAsync,
    deleteImageLoading: deleteImageMutation.isPending,
    deleteImageError: deleteImageMutation.error,
    isLoading: getPorjectMutation.isPending,
    getProjectsError: getPorjectMutation.error,
  };
};
