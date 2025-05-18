import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { getAllProjectTasks } from "../api/projectTasks";
import { useTaskSocket } from "./useTaskSocket";
import { useTaskMutations } from "./useTaskMutations";

export const useTaskManagement = (userId, projectId) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [editTask, setEditTask] = useState(null);
  const [detailsModal, setDetailsModal] = useState({ show: false, task: null });
  const [deleteModal, setDeleteModal] = useState({ show: false, taskId: null });
  const [isDeleting, setIsDeleting] = useState(false);

  const { data, isError, error } = useQuery({
    queryKey: ["projectTasks", userId, projectId],
    queryFn: () => getAllProjectTasks(userId, projectId),
    enabled: !!userId && !!projectId,
  });

  const {
    createMutation,
    deleteMutation,
    updateMutation,
    fetchTaskDetails,
  } = useTaskMutations(userId, projectId);

  useTaskSocket(userId, projectId, queryClient);

  const handleAddTask = async (taskData) => {
    try {
      if (editTask) {
        await updateMutation.mutateAsync({ taskId: editTask._id, taskData });
        setEditTask(null);
      } else {
        await createMutation.mutateAsync(taskData);
      }
      return true;
    } catch (err) {
      console.error("Failed to save task:", err);
      toast.error("Failed to save task!");
      return false;
    }
  };

  const handleDeleteTask = async (taskId) => {
    setIsDeleting(true);
    try {
      await deleteMutation.mutateAsync(taskId);
      setDeleteModal({ show: false, taskId: null });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleFetchTaskDetails = (taskId) => {
    fetchTaskDetails.mutate(
      { taskId },
      {
        onSuccess: (data) => {
          const task = data.doc || data;
          if (!task) {
            throw new Error("No task data returned from API");
          }
          setDetailsModal({ show: true, task });
        },
      }
    );
  };

  return {
    data,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    editTask,
    setEditTask,
    detailsModal,
    setDetailsModal,
    deleteModal,
    setDeleteModal,
    isDeleting,
    handleAddTask,
    handleDeleteTask,
    handleFetchTaskDetails,
    updateMutation,
  };
}; 