import React from 'react';
import './ProjectsStyle.css';
import cardImg from '../../../assets/cardImg.png'
function Projects() {



    const projects = [
        {
            title: "Headline",
            description:
                "Write an amazing description in this dedicated card section. Each word counts.",
            date: "Sep 25, 2024",
            //   image: "https://source.unsplash.com/600x400/?ferris-wheel",
        },
        {
            title: "Headline",
            description:
                "Write an amazing description in this dedicated card section. Each word counts.",
            date: "Sep 25, 2024",
            //   image: "https://source.unsplash.com/600x400/?ferris-wheel",
        },
        {
            title: "Headline",
            description:
                "Write an amazing description in this dedicated card section. Each word counts.",
            date: "Sep 25, 2024",
            //   image: "https://source.unsplash.com/600x400/?ferris-wheel",
        },
    ];
    return <>
        {/* <section>
            <div className="container">
                <div className="row">
                    <div className="col-lg-3">
                        <div>
                            <div className="card">
                                <div className="card-body">
                                    <h5 className="card-title">Project 1</h5>
                                    <p className="card-text">Project Description</p>
                                    <a href="#" className="btn btn-primary">View</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section> */}
        <div className="bg-light  d-flex align-items-center">
            <div className="container py-3">
                <div className='d-flex justify-content-between align-items-center mt-3'>
                    <h2 className="mb-4 fw-bold">Projects</h2>
                    <button className='btn btn-primary'>Add Project</button>
                </div>
                <div className="row">
                    {projects.map((project, index) => (
                        <div className="col-md-4 mb-4" key={index}>
                            <div className="card shadow-sm">
                                <div className="position-relative">
                                    <img
                                        src={cardImg}
                                        alt={project.title}
                                        className="card-img-top"
                                    />
                                    <div className="overlay position-absolute top-0 start-0 w-100 h-100 p-3 d-flex flex-column justify-content-end">
                                        <h5 className="fw-bold text-white">{project.title}</h5>
                                        <p className="text-white">{project.description}</p>
                                    </div>
                                </div>
                                <div className="card-body text-center">
                                    <button className="btn btn-primary w-100">Join</button>
                                    <p className="text-muted small mt-2">Created on {project.date}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </>;
}

export default Projects;