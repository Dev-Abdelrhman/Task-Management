import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../../stores/authStore";
import {
  addProject,
  updateProject,
  deleteProjectImage,
} from "../../../../api/project";
import { Button, CircularProgress } from "@mui/material";
import { Plus, Upload, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categories } from "../../../../constants/categories";
import ProjectImageUpload from "./ProjectImageUpload";
import ProjectFormFields from "./ProjectFormFields";

const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 400;

function AddProjectBtn({
  isEditMode = false,
  projectToEdit = {},
  open,
  onClose,
}) {
  const { user } = useAuthStore();
  const [newProject, setNewProject] = useState({
    name: "",
    description: "",
    dueDate: "",
    category: "",
    imageFile: null,
    existingImage: [],
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [localShowModal, setLocalShowModal] = useState(false);
  const [isDeletingImage, setIsDeletingImage] = useState(false);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (isEditMode) {
      setNewProject({
        name: projectToEdit.name.slice(0, MAX_NAME_LENGTH) || "",
        description:
          projectToEdit.description.slice(0, MAX_DESCRIPTION_LENGTH) || "",
        dueDate: projectToEdit.dueDate || "",
        category: projectToEdit.category || "",
        imageFile: null,
        existingImage: projectToEdit.image || [],
      });
      if (projectToEdit.image) {
        setImagePreview(projectToEdit.image);
      }
    }
  }, [isEditMode, projectToEdit]);

  const mutation = useMutation({
    mutationFn: isEditMode
      ? () => updateProject(projectToEdit._id, createFormData())
      : () => addProject(user._id, createFormData()),
    onSuccess: () => {
      queryClient.invalidateQueries(["projects"]);
      resetForm();
      toast.success(
        isEditMode
          ? "Project updated successfully"
          : "Project added successfully!"
      );
      handleClose();
      if (isEditMode) onClose();
    },
    onError: () => {
      toast.error(
        isEditMode ? "Failed to update project" : "Failed to add project"
      );
    },
  });

  const showModal = isEditMode ? open : localShowModal;
  const isLoading = mutation.isPending;

  const handleClose = () => {
    if (isLoading || isDeletingImage) return;
    if (isEditMode) {
      onClose();
    } else {
      setLocalShowModal(false);
    }
    resetForm();
  };

  const resetForm = () => {
    setNewProject({
      name: "",
      description: "",
      dueDate: "",
      category: "",
      imageFile: null,
      existingImage: [],
    });
    setImagePreview(null);
  };

  const handleFileChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setNewProject((prev) => ({
          ...prev,
          imageFile: file,
          existingImage: [],
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutation.mutate();
  };

  const createFormData = () => {
    const formData = new FormData();
    if (isEditMode) {
      if (newProject.name.trim() !== "")
        formData.append("name", newProject.name);
      if (newProject.description.trim() !== "")
        formData.append("description", newProject.description);
      if (newProject.dueDate) formData.append("dueDate", newProject.dueDate);
      if (newProject.category) formData.append("category", newProject.category);
      if (newProject.imageFile instanceof File)
        formData.append("image", newProject.imageFile);
    } else {
      formData.append("name", newProject.name);
      formData.append("description", newProject.description);
      formData.append("dueDate", newProject.dueDate);
      formData.append("category", newProject.category);
      if (newProject.imageFile instanceof File)
        formData.append("image", newProject.imageFile);
    }
    return formData;
  };

  const handleInputs = (e) => {
    const { name, value } = e.target;
    if (name === "name" && value.length > MAX_NAME_LENGTH) return;
    if (name === "description" && value.length > MAX_DESCRIPTION_LENGTH) return;
    setNewProject({ ...newProject, [name]: value });
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
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
          onClick={handleClose}
        >
          <div
            className="bg-white dark:bg-[#080808] !rounded-xl shadow-md p-6 w-full max-w-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between text-center items-center mb-4">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-400">
                {isEditMode ? "Updating Project" : "Create New Project"}
              </h3>
              <div>
                <button
                  onClick={handleClose}
                  className="text-gray-400 hover:text-gray-900"
                  disabled={isLoading || isDeletingImage}
                >
                  ✖
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mt-6">
              <ProjectImageUpload
                imagePreview={imagePreview}
                existingImage={newProject.existingImage}
                onFileChange={handleFileChange}
                isDeletingImage={isDeletingImage}
                setIsDeletingImage={setIsDeletingImage}
                setImagePreview={setImagePreview}
                setNewProject={setNewProject}
                projectToEdit={projectToEdit}
                user={user}
                isLoading={isLoading}
              />

              <ProjectFormFields
                newProject={newProject}
                handleInputs={handleInputs}
                categories={categories}
                MAX_NAME_LENGTH={MAX_NAME_LENGTH}
                MAX_DESCRIPTION_LENGTH={MAX_DESCRIPTION_LENGTH}
                isEditMode={isEditMode}
                isLoading={isLoading}
                isDeletingImage={isDeletingImage}
              />

              <Button
                type="submit"
                disabled={isLoading || isDeletingImage}
                className="w-full !text-base !font-normal !capitalize !bg-[#546FFF] !text-white !py-3 !rounded-xl"
              >
                {isLoading || isDeletingImage ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : isEditMode ? (
                  "Update Project"
                ) : (
                  "Add New Project"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default AddProjectBtn;
