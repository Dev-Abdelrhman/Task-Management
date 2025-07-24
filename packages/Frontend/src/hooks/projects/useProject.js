import { useMutation } from "@tanstack/react-query";
import { daleteProjectImage } from "../../api/project";
export const useProject = () => {
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
