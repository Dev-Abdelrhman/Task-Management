import { useState } from "react";
import { Button } from "@mui/material";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "../../../../api/project";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../../stores/authStore";

const DeleteProjectModal = ({ projectId, projectData, onClose }) => {
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () => deleteProject(user._id, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast.success("Project deleted successfully!");
      onClose();
    },
    onError: (error) => {
      console.error("Error deleting project:", error);
      toast.error("Failed to delete project.");
    },
  });

  const handleDelete = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#222222] p-8 rounded-xl max-w-[600px] relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="flex flex-col items-center mb-6">
          <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6 text-red-500 dark:text-red-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            Are you sure you want to delete this project?
          </h3>
        </div>

        <p className="text-gray-600 dark:text-gray-400 mb-6 text-center">
          All users will lose access to project{" "}
          <span className="font-medium">{projectData.name}</span> and all backup
          snapshots for this project will be removed.
        </p>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-center">
          Are you sure you wish to proceed?
        </p>

        <div className="mb-6">
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
            Type "{projectData.name}" to confirm your action
          </p>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-[#333333] dark:text-gray-300 !rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={`Type ${projectData.name}`}
            value={deleteConfirmation}
            onChange={(e) => setDeleteConfirmation(e.target.value)}
          />
        </div>

        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="px-4 py-2 !text-gray-700 dark:!text-gray-300 bg-gray-100 dark:!bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md "
          >
            Cancel
          </Button>
          <Button
            onClick={handleDelete}
            className="px-4 py-2 hover:shadow-lg hover:shadow-red-500 !text-white dark:text-white !bg-red-600 hover:bg-red-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={
              deleteConfirmation.trim().toLowerCase() !==
              projectData.name.trim().toLowerCase()
            }
          >
            Delete Project
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteProjectModal;
