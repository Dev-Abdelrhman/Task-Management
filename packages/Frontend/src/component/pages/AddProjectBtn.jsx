import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../stores/authStore";
import { addProject, updateProject } from "../../api/project";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";

function AddProjectBtn({ isEditMode = false, projectToEdit = {}, open, onClose }) {
    const { user } = useAuthStore();
    const [newProject, setNewProject] = useState({
        name: projectToEdit.name || "",
        description: projectToEdit.description || "",
        dueDate: projectToEdit.dueDate || "",
    });
    
    const [localShowModal, setLocalShowModal] = useState(false);
    const queryClient = useQueryClient();

    // Determine modal visibility based on mode
    const showModal = isEditMode ? open : localShowModal;

    const handleClose = () => {
        if (isEditMode) {
            onClose(); // Notify parent to close
        } else {
            setLocalShowModal(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate();
    }

    const mutation = useMutation({
        mutationFn: isEditMode 
            ? () => updateProject(projectToEdit._id, newProject) 
            : () => addProject(user._id, newProject),
        onSuccess: () => {
            queryClient.invalidateQueries(["projects"]);
            toast.success(isEditMode ? "Project updated successfully" : "Project added successfully!");
            handleClose();
        },
        onError: () => {
            toast.error(isEditMode ? "Failed to update project" : "Failed to add project");
        },
    })

    const handleInputs = (e) => {
        const { name, value } = e.target;
        setNewProject({ ...newProject, [name]: value })
    }

    return <>
        {!isEditMode && (
            <Button
                onClick={() => setLocalShowModal(true)}
                className="!text-base !font-normal !capitalize !bg-[#546FFF] !text-white !py-3 !rounded-xl">
                + Add Project
            </Button>
        )}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={handleClose}>
                <div
                    className="bg-white !rounded-xl shadow-md p-6 w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between text-center items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">
                            {isEditMode ? "Updating Project" : "Create New Project"}</h3>
                        <button
                            onClick={handleClose}
                            className="text-gray-400 hover:text-gray-900">
                            ✖
                        </button>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Input fields remain the same */}
                        <div>
                            <label htmlFor="projectName" className="block mb-1 text-border font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                className="w-full p-2 py-3 border !rounded-[5px] text-sm focus:outline-gray-400"
                                placeholder="Type project name"
                                id="projectName" 
                                name="name"
                                value={newProject.name}
                                onChange={handleInputs}
                                required
                            />
                        </div>

                        <div>
                            <label htmlFor="projectDescription" className="block mb-1 text-border font-medium text-gray-700">Description</label>
                            <textarea
                                rows="3"
                                className="w-full p-2 border !rounded-[5px] text-sm focus:outline-gray-400"
                                placeholder="Write Project description"
                                id="projectDescription"
                                name="description"
                                value={newProject.description}
                                onChange={handleInputs}
                            ></textarea>
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
}

export default AddProjectBtn;