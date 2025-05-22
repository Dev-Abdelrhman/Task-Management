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
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: ["projectTasks", userId, projectId],
      });

      // Snapshot the previous value
      const previousTasks = queryClient.getQueryData([
        "projectTasks",
        userId,
        projectId,
      ]);

      // Create a temporary ID for optimistic update
      const tempId = `temp-${Date.now()}`;

      // Optimistically update to the new value
      queryClient.setQueryData(["projectTasks", userId, projectId], (old) => {
        const tasks = old?.doc || [];
        const optimisticTask = {
          ...newTask,
          _id: tempId,
          status: newTask.status || "Pending",
          dueDate: newTask.dueDate || new Date().toISOString(),
        };
        return {
          ...old,
          doc: [...tasks, optimisticTask],
        };
      });

      return { previousTasks, tempId };
    },
    onSuccess: (data, variables, context) => {
      // Update the cache with the real data, replacing the temporary task
      queryClient.setQueryData(["projectTasks", userId, projectId], (old) => {
        const tasks = old?.doc || [];
        return {
          ...old,
          doc: tasks
            .map((task) => (task._id === context.tempId ? data.doc : task))
            .filter(
              (task) => task._id !== context.tempId || task._id === data.doc._id
            ),
        };
      });
      toast.success("Task created successfully!");
    },
    onError: (err, variables, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ["projectTasks", userId, projectId],
          context.previousTasks
        );
      } else {
        queryClient.invalidateQueries({
          queryKey: ["projectTasks", userId, projectId],
        });
      }
      toast.error("Failed to create task!");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache is in sync
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", userId, projectId],
      });
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
