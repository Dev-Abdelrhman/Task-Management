import { useMutation } from "@tanstack/react-query";
import { getUserProjects } from "../api/project";
import { toast } from "react-toastify";
import { useProjecthStore } from "../stores/projectStore";

export const useProject = () => {
  const { projects, setProject } = useProjectStore();

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

  return {
    projects: getPorjectMutation.mutateAsync,
    isLoading: getPorjectMutation.isPending,
    getProjectsError: getPorjectMutation.error,
  };
};
