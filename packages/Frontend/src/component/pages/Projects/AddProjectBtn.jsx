import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../stores/authStore";
import {
  addProject,
  updateProject,
  deleteProjectImage,
} from "../../../api/project";
import { Button, CircularProgress } from "@mui/material";
import { Plus, Upload, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 400;

const categories = [
  "UI/UX",
  "Development",
  "Marketing",
  "Product Management",
  "Business Strategy",
  "Operations",
  "Sales",
  "Customer Support",
  "Finance",
  "Legal",
  "Human Resources",
  "IT Support",
  "Research & Development",
  "Data Science",
  "Machine Learning",
  "Artificial Intelligence",
  "Cybersecurity",
  "Blockchain",
  "E-commerce",
  "Supply Chain",
  "Logistics",
  "Event Management",
  "Healthcare",
  "Real Estate",
  "Education",
  "Non-Profit",
  "Construction",
  "Retail",
  "Entertainment",
  "Media & Publishing",
  "Public Relations",
  "Government",
  "Telecommunications",
  "Design",
  "Consulting",
  "Travel & Hospitality",
  "Frontend Development",
  "Backend Development",
  "Fullstack Development",
  "Quality Assurance",
  "Testing",
  "Bug Fixing",
  "DevOps",
  "Continuous Integration",
  "Deployment",
  "Cloud Computing",
  "AWS",
  "Google Cloud",
  "Azure",
  "Augmented Reality",
  "Virtual Reality",
  "AR/VR Development",
  "Internet of Things",
  "IoT Development",
  "Smart Devices",
  "Automation",
  "Robotic Process Automation (RPA)",
  "CRM Development",
  "Customer Insights",
  "CRM Integration",
  "ERP Development",
  "Enterprise Solutions",
  "Business Systems",
  "Game Development",
  "Unity Development",
  "Unreal Engine",
  "AI Ethics",
  "Ethical AI",
  "AI Regulations",
];

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
      setNewProject({
        name: "",
        description: "",
        dueDate: "",
        category: "",
        imageFile: null,
        existingImage: [],
      });
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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
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
              <div className="flex flex-col justify-center items-center mb-4">
                {newProject.existingImage.length > 0 || imagePreview ? (
                  <div className="relative mb-3">
                    {newProject.existingImage.length > 0 ? (
                      <img
                        src={newProject.existingImage?.[0]?.url || imagePreview}
                        alt="Project preview"
                        className="rounded-3xl h-40 w-full object-cover"
                      />
                    ) : imagePreview[0] ? (
                      <img
                        src={imagePreview}
                        alt="Project preview"
                        className="rounded-3xl h-40 w-full object-cover"
                      />
                    ) : (
                      <img
                        src="https://fakeimg.pl/1280x720?text=No+Image"
                        alt="Project preview"
                        className="rounded-3xl h-40 w-full object-cover"
                      />
                    )}

                    {newProject.existingImage.length === 0 ? null : (
                      <button
                        type="button"
                        onClick={async () => {
                          setIsDeletingImage(true);
                          try {
                            if (newProject.existingImage?.[0]?.public_id) {
                              await deleteProjectImage(
                                user._id,
                                projectToEdit._id,
                                newProject.existingImage[0].public_id
                              );
                            }
                            toast.success("Image removed successfully");
                            setImagePreview(null);
                            setNewProject((prev) => ({
                              ...prev,
                              imageFile: null,
                              existingImage: [],
                            }));
                          } catch (error) {
                            toast.error("Failed to remove image");
                            console.error("Delete image error:", error);
                          } finally {
                            setIsDeletingImage(false);
                          }
                        }}
                        className="absolute -right-8 bottom-1 p-1 rounded-full"
                        disabled={isLoading || isDeletingImage}
                      >
                        {isDeletingImage ? (
                          <CircularProgress
                            size={24}
                            sx={{ color: "#dc2626" }}
                          />
                        ) : (
                          <Trash className="w-5 h-5 text-red-600 " />
                        )}
                      </button>
                    )}
                  </div>
                ) : null}

                <label
                  htmlFor="projectImage"
                  className={`flex gap-2 p-2 justify-center cursor-pointer border border-dashed border-gray-400 px-4 py-3 rounded-[10px] bg-[#f8f8f8] mb-1 text-border font-medium ${
                    isLoading || isDeletingImage
                      ? "text-gray-400 cursor-not-allowed"
                      : "text-gray-700"
                  }`}
                >
                  Upload image
                  <Upload />
                </label>
                <input
                  type="file"
                  className="hidden"
                  id="projectImage"
                  name="image"
                  onChange={handleFileChange}
                  disabled={isLoading || isDeletingImage}
                />
              </div>

              {/* Existing name input */}
              <div>
                <label
                  htmlFor="projectName"
                  className="block mb-1 text-border dark:text-gray-400 font-medium text-gray-700"
                >
                  Name
                </label>
                <input
                  type="text"
                  className="w-full dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-400 p-2 py-3 border !rounded-[5px] text-sm focus:outline-gray-400"
                  placeholder="Type project name"
                  id="projectName"
                  name="name"
                  value={newProject.name}
                  onChange={handleInputs}
                  required={!isEditMode}
                  disabled={isLoading || isDeletingImage}
                />
                <span className="block text-xs text-gray-500 mt-1">
                  Characters left: {MAX_NAME_LENGTH - newProject.name.length}
                </span>
              </div>

              {/* Category Select Input */}
              <div>
                <label
                  htmlFor="projectCategory"
                  className="block dark:text-gray-400 mb-1 text-border font-medium text-gray-700"
                >
                  Category
                </label>
                <select
                  id="projectCategory"
                  name="category"
                  value={newProject.category}
                  onChange={handleInputs}
                  required={!isEditMode}
                  disabled={isLoading || isDeletingImage}
                  className="w-full dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500 p-2 py-3 border !rounded-[5px] text-sm focus:outline-gray-400"
                >
                  <option className="dark:text-gray-300" value="">
                    Select a category
                  </option>
                  {categories.map((category) => (
                    <option
                      key={category}
                      className="dark:text-gray-300"
                      value={category}
                    >
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              {/* Existing description input */}
              <div>
                <label
                  htmlFor="projectDescription"
                  className="block dark:text-gray-400 mb-1 text-border font-medium text-gray-700"
                >
                  Description
                </label>
                <textarea
                  rows="3"
                  className="w-full dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-400 p-2 border !rounded-[5px] text-sm focus:outline-gray-400"
                  placeholder="Write Project description"
                  id="projectDescription"
                  name="description"
                  value={newProject.description}
                  onChange={handleInputs}
                  required={!isEditMode}
                  disabled={isLoading || isDeletingImage}
                ></textarea>
                <span className="block text-xs text-gray-500 mt-1">
                  Characters left:{" "}
                  {MAX_DESCRIPTION_LENGTH - newProject.description.length}
                </span>
              </div>

              {/* Existing due date input */}
              <div>
                <label
                  htmlFor="dueDate"
                  className="block dark:text-gray-400 mb-1 text-border font-medium text-gray-700"
                >
                  Due Date
                </label>
                <input
                  type="date"
                  className="w-full dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-400 p-2 py-3 border !rounded-[5px] text-sm focus:outline-gray-400"
                  placeholder="Select due date"
                  id="dueDate"
                  name="dueDate"
                  value={newProject.dueDate}
                  onChange={handleInputs}
                  required={!isEditMode}
                  disabled={isLoading || isDeletingImage}
                />
              </div>

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
