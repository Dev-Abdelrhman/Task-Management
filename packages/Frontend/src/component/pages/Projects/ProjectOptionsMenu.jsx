import { useState } from "react";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "../../../api/project";
import AddProjectBtn from "./AddProjectBtn";
import ReactDOM from "react-dom";
import { X } from "lucide-react";
import { useAuthStore } from "../../../stores/authStore";
function ProjectOptionsMenu({ projectId, projectData }) {
  const [showMenu, setShowMenu] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const mutation = useMutation({
    mutationFn: () => deleteProject(user._id, projectId),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast.success("Project deleted successfully!");
      setShowForm(false);
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
    <div className="flex">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        className="!absolute !right-0 !text-black !text-lg  !rounded-full !w-1 !p-0 !mx-1 !hover:bg-gray-200"
      >
        •••
      </Button>

      {showMenu && (
        <div className="!absolute !right-0 !mx-3 !mt-8 !z-10 !w-31 !bg-white !shadow-md !rounded-[10px]">
          <Button
            onClick={() => {
              setIsEditMode(true);
              setShowMenu(false);
            }}
            className="block w-full px-3 py-2 text-sm !text-gray-700 hover:bg-gray-100"
          >
            Edit
          </Button>
          <hr />
          <Button
            onClick={() => setShowForm(true)}
            className="block w-full py-2 text-sm !text-red-500 hover:bg-gray-100"
          >
            Delete
          </Button>
        </div>
      )}

      {isEditMode &&
        ReactDOM.createPortal(
          <AddProjectBtn
            isEditMode={true}
            projectToEdit={projectData}
            open={isEditMode}
            onClose={() => setIsEditMode(false)}
          />,
          document.getElementById("modal-root")
        )}

      {showForm &&
        ReactDOM.createPortal(
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white p-8 rounded-xl max-w-[600px] relative">
              {/* Close button */}
              <button
                onClick={() => setShowForm(false)}
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <svg
                    className="w-6 h-6 text-red-500"
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
                <h3 className="text-2xl font-bold text-gray-900">
                  Are you sure you want to delete this project?
                </h3>
              </div>

              <p className="text-gray-600 mb-6 text-center">
                All users will lose access to project{" "}
                <span className="font-medium">{projectData.name}</span> and all
                backup snapshots for this project will be removed.
              </p>
              <p className="text-gray-600 mb-4 text-center">
                Are you sure you wish to proceed?
              </p>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Type "{projectData.name}" to confirm your action
                </p>
                <input
                  type="text"
                  className="w-full px-3 py-2  border border-gray-300 !rounded-[5px] focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Type ${projectData.name}`}
                  value={deleteConfirmation}
                  onChange={(e) => setDeleteConfirmation(e.target.value)}
                />
              </div>

              {/* Action buttons */}
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => setShowForm(false)}
                  className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleDelete}
                  className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={
                    deleteConfirmation.trim().toLowerCase() !==
                    projectData.name.trim().toLowerCase()
                  }
                >
                  Delete Project
                </Button>
              </div>
            </div>
          </div>,
          document.getElementById("modal-root")
        )}
    </div>
  );
}

export default ProjectOptionsMenu;
