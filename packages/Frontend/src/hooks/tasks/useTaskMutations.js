import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  createProjectTask,
  deleteTaskStatus,
  updateTaskStatus,
  getOneTask,
} from "../../api/projectTasks";

export const useTaskMutations = (userId, projectId) => {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (newTask) => createProjectTask(userId, projectId, newTask),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({
        queryKey: ["projectTasks", userId, projectId],
      });
      const previousTasks = queryClient.getQueryData([
        "projectTasks",
        userId,
        projectId,
      ]);
      const tempId = `temp-${Date.now()}`;

      queryClient.setQueryData(["projectTasks", userId, projectId], (old) => {
        if (!old?.doc) return { doc: [{ ...newTask, _id: tempId }] };
        return {
          ...old,
          doc: [
            ...old.doc,
            {
              ...newTask,
              _id: tempId,
              status: newTask.status || "Pending",
              dueDate: newTask.dueDate || new Date().toISOString(),
            },
          ],
        };
      });
      return { previousTasks, tempId };
    },
    onSuccess: () => {
      toast.success("Task created successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", userId, projectId],
      });
    },
    onError: (err, _, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["projectTasks", userId, projectId],
          context.previousTasks
        );
      }
      toast.error("Failed to create task!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: ({ taskId, status }) =>
      deleteTaskStatus(userId, projectId, taskId, status),
    onSuccess: () => {
      toast.success("Task deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", userId, projectId],
      });
    },
    onError: () => toast.error("Failed to delete task!"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskId, taskData }) =>
      updateTaskStatus(userId, projectId, taskId, taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", userId, projectId],
      });
    },
    onError: (err) => {
      console.error("Error updating task:", err.message);
      toast.error("Failed to update task!");
    },
  });

  const fetchTaskDetails = useMutation({
    mutationFn: (taskId) => getOneTask(userId, projectId, taskId),
    onError: (err) => {
      console.error("Error retrieving task:", err.message);
      toast.error("Failed to retrieve task!");
    },
  });

  return {
    createMutation,
    deleteMutation,
    updateMutation,
    fetchTaskDetails,
  };
};
