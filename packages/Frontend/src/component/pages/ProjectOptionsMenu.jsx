import { useState } from "react";
import { Button } from "@mui/material";
import { toast } from "react-toastify";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteProject } from "../../api/project";
import AddProjectBtn from "./AddProjectBtn";
import ReactDOM from 'react-dom';

function ProjectOptionsMenu({ projectId, projectData }) {
    const [showMenu, setShowMenu] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: () => deleteProject(projectId),
        onSuccess: () => {
            queryClient.invalidateQueries(["projects"]);
            toast.success("Project deleted successfully!");
            setShowForm(false);
        },
        onError: () => {
            toast.error("Failed to delete project.");
        },
    });

    const handleDelete = (e) => {
        e.preventDefault()
        mutation.mutate();
    };

    return (
        <div className="flex">
            <Button
                onClick={() => setShowMenu(!showMenu)}
                className="!absolute !right-0 !text-black !text-2xl !px-1 !py-1 !mx-3  !rounded-full !hover:bg-gray-200 !transition">
                •••
            </Button>

            {showMenu && (
                <div className="!absolute !right-0 !mx-3 !mt-8 !z-10 !w-31 !bg-white !shadow-md !rounded-md">
                    <Button
                        onClick={() => {
                            setIsEditMode(true);
                            setShowMenu(false);
                        }}
                        className="block px-4 py-2 text-sm !text-gray-700 hover:bg-gray-100">
                        Edit
                    </Button>
                    <hr />
                    <Button
                        onClick={() => setShowForm(true)}
                        className="block px-4 py-2 text-sm !text-red-500 hover:bg-gray-100">
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
                    document.getElementById('modal-root')
                )}

            {showForm &&
                ReactDOM.createPortal(
                    <div className="!fixed !inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white p-6 rounded-xl w-full max-w-md">
                            <div className="text-center mb-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    Are you sure you want to delete this project?
                                </h3>
                            </div>
                            <div className="flex justify-between">
                                <Button onClick={() => setShowForm(false)} className="bg-gray-300 !text-black py-2 px-4 rounded-md">
                                    No
                                </Button>
                                <Button onClick={handleDelete} className="!text-red-500 py-2 px-4 rounded-md">
                                    Yes, Delete
                                </Button>
                            </div>
                        </div>
                    </div>,
                    document.getElementById('modal-root')
                )}
        </div>
    );
}

export default ProjectOptionsMenu;