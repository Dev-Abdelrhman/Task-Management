import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../stores/authStore";
import { addProject } from "../../api/project";
import { Button } from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
function AddProjectBtn() {

    const { user } = useAuthStore();
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [showModal, setShowModal] = useState(false);
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: (newProject) => addProject(user._id, newProject),
        onSuccess: () => {
            queryClient.invalidateQueries(["projects"]);
            toast.success("Project added successfully!");
            setShowModal(false);
            setProjectName("");
            setProjectDescription("");
        },
        onError: () => {
            toast.error("Failed to add project");
        },
    });
    const handleSave = () => {
        mutation.mutate({
            name: projectName,
            description: projectDescription,
        });
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
                    className="bg-white rounded-lg shadow-md p-6 w-full max-w-md"
                    onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-lg font-semibold text-gray-900">Create New Product</h3>
                        <button
                            onClick={() => setShowModal(false)}
                            className="text-gray-400 hover:text-gray-900">
                            ✖
                        </button>
                    </div>

                    <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
                        <div>
                            <label htmlFor="projectName" className="block mb-1 text-sm font-medium text-gray-700">Name</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg text-sm"
                                placeholder="Type product name"
                                id="projectName" value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                                required
                            />
                        </div>


                        <div>
                            <label htmlFor="projectDescription" className="block mb-1 text-sm font-medium text-gray-700">Description</label>
                            <textarea
                                rows="3"
                                className="w-full p-2 border rounded-lg text-sm"
                                placeholder="Write product description"
                                id="projectDescription"
                                value={projectDescription}
                                onChange={(e) => setProjectDescription(e.target.value)}
                            ></textarea>
                        </div>

                        <button onClick={handleSave}
                            type="submit"
                            className="w-full text-white bg-blue-700 hover:bg-blue-800 rounded-lg py-2 text-sm"
                        >
                            Add new product
                        </button>
                    </form>
                </div>
            </div>
        )}

    </>
}

export default AddProjectBtn;