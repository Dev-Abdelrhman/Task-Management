import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../stores/authStore";
import { addProject } from "../../api/project";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
function AddProjectBtn() {
    const { user } = useAuthStore();
    const [newProject, setNewProject] = useState({
        name: "",
        description: "",
        dueDate: "",
    });
    const [showModal, setShowModal] = useState(false);
    const queryClient = useQueryClient();
    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate();
    }
    const mutation = useMutation({
        mutationFn: () => addProject(user._id, newProject),
        onSuccess: () => {
            queryClient.invalidateQueries(["projects"]);
            toast.success("Project added successfully!");
            setShowModal(false);
        },
        onError: () => {
            toast.error("Failed to add project");
        },
    });

    const handleInputs = (e) => {
        const { name, value } = e.target;
        setNewProject({ ...newProject, [name]: value });
    };

    return <>
        <Button
            onClick={() => setShowModal(true)}
            className=" !text-base !font-normal !capitalize !bg-[#546FFF] !text-white !py-3 !rounded-xl">
            + Add Project
        </Button>
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" onClick={() => setShowModal(false)} >
                <div
                    className="bg-white !rounded-xl shadow-md p-6 w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between text-center items-center mb-4">
                        <h3 className="text-xl font-semibold text-gray-900">Create New Product</h3>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-400 hover:text-gray-900">
                            ✖
                        </button>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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

                        <Button onClick={handleSubmit}
                            type="submit"
                            className="w-full !text-base !font-normal !capitalize !bg-[#546FFF] !text-white !py-3 !rounded-xl"
                        >
                            Add new project
                        </Button>
                    </form>
                </div>
            </div>
        )}

    </>
}

export default AddProjectBtn;