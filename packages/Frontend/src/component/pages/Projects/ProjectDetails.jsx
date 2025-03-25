import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Img from '/src/assets/pro-details.jpg'
import './ProjectsStyle.css';
import axios from 'axios';

function ProjectDetails() {
    const { id } = useParams();
    const [project, setProject] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        axios.get(`http://localhost:9999/depiV1/users/67cd552eeb136fc473543ae1/projects`, {
            headers: { Authorization: `Bearer ${token}` }
        })
        .then((response) => {
            const foundProject = response.data.data.find(proj => proj._id === id);
            
            setProject(foundProject || null); 
        })
        .catch((error) => console.error("Error fetching project details:", error));
    }, [id]);

    if (!project) return <p>Loading...</p>;

    return (
        <div className="details container py-5 ">
            <img src={Img} alt="" className='imageDet rounded w-60' />
            <h2 className='text-black fw-bold pt-4 '>{project.name}</h2>
            <p className='fs-4'>{project.description}</p>
        </div>
    );
}

export default ProjectDetails;
