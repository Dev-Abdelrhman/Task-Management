import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  getAllUserTasks,
  createTask,
  deleteTask,
  updateTask,
  getTaskById,
} from "../api/user_tasks";

export const useUserTaskManagement = () => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, taskId: null });
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskDetailsModal, setTaskDetailsModal] = useState({
    show: false,
    task: null,
  });

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getAllUserTasks,
  });

  const createMutation = useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);
      const tempId = `temp-${Date.now()}`;

      queryClient.setQueryData(["tasks"], (old) => {
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
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["tasks"], context.previousTasks);
      toast.error("Failed to create task!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      toast.success("Task deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => toast.error("Failed to delete task!"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      console.error("Error updating task:", err.message);
      toast.error("Failed to update task!");
    },
  });

  const fetchTaskDetails = useMutation({
    mutationFn: (id) => getTaskById(id),
    onSuccess: (data) => {
      setTaskDetailsModal({ show: true, task: data.doc });
    },
    onError: (err) => {
      console.error("Error retrieving task:", err.message);
      toast.error("Failed to retrieve task!");
    },
  });

  const handleTaskClick = (task) => {
    if (task.title && task.description) {
      setTaskDetailsModal({ show: true, task });
    } else {
      fetchTaskDetails.mutate(task._id);
    }
  };

  const handleAddTask = async (taskData) => {
    try {
      if (editingTask) {
        await updateMutation.mutateAsync({
          id: editingTask._id,
          updates: taskData,
        });
      } else {
        await createMutation.mutateAsync(taskData);
      }
      setShowModal(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Failed to process task:", err);
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

  return {
    data,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    showModal,
    setShowModal,
    deleteModal,
    setDeleteModal,
    selectedColumn,
    setSelectedColumn,
    isDeleting,
    editingTask,
    setEditingTask,
    taskDetailsModal,
    setTaskDetailsModal,
    handleTaskClick,
    handleAddTask,
    handleDeleteTask,
    updateMutation,
  };
}; 