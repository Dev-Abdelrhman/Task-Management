import React, { useEffect, useState } from 'react';
import './ProjectsStyle.css';
import cardImg from '../../../assets/cardImg.png'
import axios from 'axios';
import AddProjectBtn from '../AddProjectBtn';
import { toast } from 'react-toastify';
function Projects() {


    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        axios.get("http://localhost:9999/depiV1/users/67cd552eeb136fc473543ae1/projects", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                // console.log("API Response:", response.data);
                setProjects(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching projects:", error);
                setLoading(false);
            });
    }, []);


    const handleDelete = (projectId) => {
        const token = localStorage.getItem("accessToken");
        axios.delete(`http://localhost:9999/depiV1/users/67cd552eeb136fc473543ae1/projects/${projectId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then(() => {
            toast.success("Project deleted successfully!");
            setProjects(prevProjects => ({
                ...prevProjects,
                data: prevProjects.data.filter(project => project._id !== projectId)
            }));
        })
        .catch(error => {
            toast.error("Error deleting project");

            console.error("Error deleting project:", error);
        });
    };

   return <>
        <div className="bg-light  d-flex align-items-center">
            <div className="container py-3">
                <div className='d-flex justify-content-between align-items-center mt-3'>
                    <h2 className="mb-4 fw-bold">Number Of Projects : {projects.totalDocuments}</h2>
                    <AddProjectBtn />
                </div>
                {loading ? <p>Loading...</p> :

                    <div className="row">

                        {projects.data?.map((project, index) => (
                            <div className="col-md-4 mb-4" key={index}>
                                <div className="card shadow-sm">
                                    <div className="position-relative">
                                        <img
                                            src={cardImg}
                                            alt={project.title}
                                            className="card-img-top"
                                        />
                                        <div className="overlay position-absolute top-0 start-0 w-100 h-100 p-3 d-flex flex-column justify-content-end">
                                            <h5 className="fw-bold text-white">{project.name}</h5>
                                            <p className="text-white">{project.description}</p>
                                        </div>
                                    </div>
                                    <div className="card-body text-center">
                                        <div className='d-flex justify-content-between align-items-center gap-4'>
                                            <button className="btn btn-primary w-100">Join</button>
                                            <div  onClick={() => handleDelete(project._id)} role='button' className='icon-container p-2 rounded-circle border border-black '>
                                                <i className="fa-regular fa-trash-can"></i>
                                            </div>
                                        </div>
                                        <p className="text-muted small mt-2">Created on {project.createdAt}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                }
            </div>
        </div>
    </>;
}

export default Projects;