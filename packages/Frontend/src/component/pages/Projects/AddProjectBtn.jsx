import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../stores/authStore";
import { addProject, updateProject } from "../../../api/project";
import { Button } from "@mui/material";
import { Plus } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddProjectBtn({
  isEditMode = false,
  projectToEdit = {},
  open,
  onClose,
}) {
  const { user } = useAuthStore();
  const [newProject, setNewProject] = useState({
    name: projectToEdit.name || "",
    description: projectToEdit.description || "",
    dueDate: projectToEdit.dueDate || "",
    image: projectToEdit.image || "",
  });

  const [localShowModal, setLocalShowModal] = useState(false);
  const queryClient = useQueryClient();

  const showModal = isEditMode ? open : localShowModal;

  const handleClose = () => {
    if (isEditMode) {
      onClose();
    } else {
      setLocalShowModal(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  const createFormData = () => {
    const formData = new FormData();

    // For edit mode: only append non-empty fields
    if (isEditMode) {
      if (newProject.name.trim() !== "") {
        formData.append("name", newProject.name);
      }
      if (newProject.description.trim() !== "") {
        formData.append("description", newProject.description);
      }
      if (newProject.dueDate) {
        formData.append("dueDate", newProject.dueDate);
      }
      if (newProject.image instanceof File) {
        formData.append("image", newProject.image);
      }
    }
    // For add mode: append all required fields
    else {
      formData.append("name", newProject.name);
      formData.append("description", newProject.description);
      formData.append("dueDate", newProject.dueDate);
      if (newProject.image instanceof File) {
        formData.append("image", newProject.image);
      }
    }

    return formData;
  };

  const mutation = useMutation({
    mutationFn: isEditMode
      ? () => updateProject(projectToEdit._id, createFormData())
      : () => addProject(user._id, createFormData()),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      toast.success(
        isEditMode
          ? "Project updated successfully"
          : "Project added successfully!"
      );
      handleClose();
    },
    onError: () => {
      toast.error(
        isEditMode ? "Failed to update project" : "Failed to add project"
      );
    },
  });

  const handleInputs = (e) => {
    const { name, value } = e.target;
    setNewProject({ ...newProject, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setNewProject((prevState) => ({ ...prevState, image: file }));
  };
  return (
    <>
      {!isEditMode && (
        <Button
          endIcon={<Plus className="w-5 h-5" />}
          onClick={() => setLocalShowModal(true)}
          className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
        >
          Add Project
        </Button>
      )}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
          onClick={handleClose}
        >
          <div
            className="bg-white !rounded-xl shadow-md p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between text-center items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                {isEditMode ? "Updating Project" : "Create New Project"}
              </h3>
              <button
                onClick={handleClose}
                className="text-gray-400 hover:text-gray-900"
              >
                ✖
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="projectName"
                  className="block mb-1 text-border font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 py-3 border !rounded-[5px] text-sm focus:outline-gray-400"
                  placeholder="Type project name"
                  id="projectName"
                  name="name"
                  value={newProject.name}
                  onChange={handleInputs}
                  required={!isEditMode} // Apply required only when not editing
                />
              </div>
              <div>
                <label
                  htmlFor="dueDate"
                  className="block mb-1 text-border font-medium text-gray-700"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full p-2 py-3 border !rounded-[5px] text-sm focus:outline-gray-400"
                  placeholder="Select due date"
                  id="dueDate"
                  name="dueDate"
                  value={newProject.dueDate}
                  onChange={handleInputs}
                  required={!isEditMode} // Apply required only when not editing
                />
              </div>
              <div>
                <label
                  htmlFor="projectDescription"
                  className="block mb-1 text-border font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  rows="3"
                  className="w-full p-2 border !rounded-[5px] text-sm focus:outline-gray-400"
                  placeholder="Write Project description"
                  id="projectDescription"
                  name="description"
                  value={newProject.description}
                  onChange={handleInputs}
                  required={!isEditMode} // Apply required only when not editing
                ></textarea>
              </div>
              <div>
                <label
                  htmlFor="projectImage"
                  className="block mb-1 text-border font-medium text-gray-700"
                >
                  Image
                </label>
                <input
                  type="file"
                  className="w-full p-2 py-3 border !rounded-[5px] text-sm focus:outline-gray-400"
                  id="projectImage"
                  // No need for required since images are typically optional in edits
                  name="image"
                  onChange={handleFileChange}
                />
              </div>
              <Button
                type="submit"
                className="w-full !text-base !font-normal !capitalize !bg-[#546FFF] !text-white !py-3 !rounded-xl"
              >
                {isEditMode ? "Update Project" : "Add New Project"}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddProjectBtn;
