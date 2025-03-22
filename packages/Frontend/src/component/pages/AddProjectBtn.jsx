import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";

function AddProjectBtn() {

    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");

    const handleSave = async () => {
        const projectData = {
            name: projectName,
            description: projectDescription
        };
        const token = localStorage.getItem("accessToken");

        if (!token) {
            alert("You are not logged in! Please log in.");
            return;
        }
        try {
            const response = await axios.post(
                "http://localhost:9999/depiV1/users/67cd552eeb136fc473543ae1/projects",
                projectData,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${token}`
                    }
                }
            );
            if (response.status === 200 || response.status === 201) {
                toast.success("Add project Successfully!");

                setProjectName("");
                setProjectDescription("");
                document.querySelector('[data-bs-dismiss="modal"]').click();

                setTimeout(() => {
                    window.location.reload();
                }, 500);
            } else {
                toast.error("Failed to add project");
            }
        } catch (error) {
            console.error("Error:", error);
            alert(error.response?.data?.message || "An error occurred while adding the project.");
        }
    };
    return <>
        <button type="button" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Add Project
        </button>

        <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="exampleModalLabel">Add Project</h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={(e) => e.preventDefault()}>
                            <div className="mb-3">
                                <label htmlFor="projectName" className="form-label">Project Name</label>
                                <input type="text" className="form-control" id="projectName" value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)} />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="projectDescription" className="form-label">Project Description</label>
                                <input type="text" className="form-control" id="projectDescription" value={projectDescription}
                                    onChange={(e) => setProjectDescription(e.target.value)} />
                            </div>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" className="btn btn-primary" onClick={handleSave}>Save changes</button>
                    </div>
                </div>
            </div>
        </div>


    </>
}

export default AddProjectBtn;