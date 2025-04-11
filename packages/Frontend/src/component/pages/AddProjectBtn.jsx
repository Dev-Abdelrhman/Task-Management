import axios from "axios";
import { useState } from "react";
import { toast } from "react-toastify";
import { useAuthStore } from "../../stores/authStore";
import { addProject } from "../../api/project";
function AddProjectBtn() {

const { user } = useAuthStore();
console.log("userData   ", user);

const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [showModal, setShowModal] = useState(false);
    // const handleSave = async () => {
    //     const projectData = {
    //         name: projectName,
    //         description: projectDescription
    //     };
    //     const token = localStorage.getItem("accessToken");

    //     if (!token) {
    //         alert("You are not logged in! Please log in.");
    //         return;
    //     }
    //     try {
    //         const response = await axios.post(
    //             "http://localhost:9999/depiV1/users/67cd552eeb136fc473543ae1/projects",
    //             projectData,
    //             {
    //                 headers: {
    //                     "Content-Type": "application/json",
    //                     "Authorization": `Bearer ${token}`
    //                 }
    //             }
    //         );
    //         if (response.status === 200 || response.status === 201) {
    //             toast.success("Add project Successfully!");

    //             setProjectName("");
    //             setProjectDescription("");
    //             document.querySelector('[data-bs-dismiss="modal"]').click();

    //             setTimeout(() => {
    //                 window.location.reload();
    //             }, 500);
    //         } else {
    //             toast.error("Failed to add project");
    //         }
    //     } catch (error) {
    //         console.error("Error:", error);
    //         alert(error.response?.data?.message || "An error occurred while adding the project.");
    //     }
    // };
    
  
    const handleSave = async () => {
        const tempId = Date.now(); 
        const newProject = {
          id: tempId,
          name: projectName,
          description: projectDescription,
        };
      
        
        setProjects((prev) => [...prev, newProject]);
      
        try {
          
          const savedProject = await addProject(user._id, {
            name: projectName,
            description: projectDescription,
          });
      
          
          setProjects((prev) =>
            prev.map((proj) =>
              proj.id === tempId ? savedProject : proj
            )
          );
        } catch (error) {
          
          console.error("Failed to save project:", error);
          setProjects((prev) =>
            prev.filter((proj) => proj.id !== tempId)
          );
        }
      
        
        setProjectName('');
        setProjectDescription('');
        setShowModal(false);
      };
      
  
  return <>
        <button
            onClick={() => setShowModal(true)}
            className="block text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
            Add Project
        </button>
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