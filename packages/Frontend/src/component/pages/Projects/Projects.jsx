import React, { useEffect, useState } from "react";
import "./ProjectsStyle.css";
import cardImg from "../../../assets/cardImg.png";
import axios from "axios";
import AddProjectBtn from "../AddProjectBtn";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { getUserProjects } from "../../../api/project";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
function Projects() {
  const { user } = useAuthStore();

  useEffect(() => {
    console.log(user._id);
    
  }, []);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return await getUserProjects(user._id);
    },
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;

  const handleDelete = (projectId) => {
    axios
      .delete(`http://localhost:9999/depiV1/users/${user._id}/${projectId}`, {
        withCredentials: true,
      })
      .then(() => {
        toast.success("Project deleted successfully!");
        setProjects((prevProjects) => ({
          ...prevProjects,
          data: prevProjects.data.filter(
            (project) => project._id !== projectId
          ),
        }));
      })
      .catch((error) => {
        toast.error("Error deleting project");

        console.error("Error deleting project:", error);
      });
  };
  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 2,
  };
  return (
    <>
      <div className="bg-light  d-flex align-items-center">
        <div className="container py-3">
          <div className="d-flex justify-content-between align-items-center mt-3">
            <h2 className="mb-4 fw-bold">
              Number Of Projects : {data.results}
            </h2>
            <h1>Omar, {user?.email}</h1>
          </div>
          <div className="flex justify-end mb-4">
            <AddProjectBtn />
          </div>
         <div className="sliderContainer  w-[1060px]">
         {isLoading ? (
            <p>Loading...</p>
          ) : (
              <Slider {...settings}>

                {data.doc.map((project, index) => (
                  <div key={index} className="cardSlider p-[10px] grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                      <img src={cardImg} alt={project.title} className="w-full h-40 object-cover" />
                      <div className="p-4">
                        <h3 className="text-lg font-semibold text-gray-800">{project.name}</h3>
                        <p className="text-sm text-gray-500">UI/UX Design</p>
                        <div className="mt-2">
                          <p className="text-sm text-gray-600">Progress</p>
                          <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: "90%" }}></div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">90%</p>
                        </div>
                        <div className="flex items-center mt-4">
                          <svg className="h-5 w-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                          </svg>
                          <p className="text-sm text-gray-600">1 Hour</p>
                          <div className="ml-auto flex -space-x-2">
                            <img src="https://images.unsplash.com/photo-1491528323818-fdd1f571ceff?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50&q=60" alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white" />
                            <img src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50&q=60" alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white" />
                            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=50&h=50&q=60" alt="Avatar" className="w-8 h-8 rounded-full border-2 border-white" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
          )}
         </div>


        </div>
      </div>
    </>
  );
}

export default Projects;
