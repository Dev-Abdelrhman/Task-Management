import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getUserProjects } from "../../api/project";
import { useAuthStore } from "../../stores/authStore";
import socket from "../../utils/socket";

export const useProjectQuery = () => {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();

  const {
    data: projectData,
    isLoading: projectLoading,
    isError: isProjectsError,
    error: projectsError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      if (!user?._id) return { doc: [] };
      return await getUserProjects(user._id);
    },
    enabled: !!user?._id,
  });

  console.log(projectData);

  useEffect(() => {
    if (!user) return;

    const handleProjectCreated = (newProject) => {
      queryClient.setQueryData(["projects"], (old) => {
        if (!old?.doc) return { doc: [newProject] };
        const tempProject = old.doc.find(
          (p) => p._id.startsWith("temp-") && p.name === newProject.name
        );
        if (tempProject) {
          return {
            ...old,
            doc: old.doc.map((p) =>
              p._id === tempProject._id ? newProject : p
            ),
          };
        }
        const exists = old.doc.some((p) => p._id === newProject._id);
        return exists ? old : { ...old, doc: [...old.doc, newProject] };
      });
    };

    const handleProjectUpdated = (updatedProject) => {
      queryClient.setQueryData(["projects"], (old) => {
        if (!old?.doc) return old;
        return {
          ...old,
          doc: old.doc.map((project) =>
            project._id === updatedProject._id ? updatedProject : project
          ),
        };
      });
    };

    const handleProjectDeleted = (deletedId) => {
      queryClient.setQueryData(["projects"], (old) => {
        if (!old?.doc) return old;
        return {
          ...old,
          doc: old.doc.filter((project) => project._id !== deletedId),
        };
      });
    };

    socket.on("project-created", handleProjectCreated);
    socket.on("project-updated", handleProjectUpdated);
    socket.on("project-deleted", handleProjectDeleted);

    return () => {
      socket.off("project-created", handleProjectCreated);
      socket.off("project-updated", handleProjectUpdated);
      socket.off("project-deleted", handleProjectDeleted);
    };
  }, [user, queryClient]);

  return {
    projects: projectData?.doc || [],
    isLoading: projectLoading,
    isError: isProjectsError,
    error: projectsError,
  };
};
