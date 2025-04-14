import React, { useEffect, useState } from "react";
import "./ProjectsStyle.css";
import cardImg from "../../../assets/cardImg.png";
import axios from "axios";
import AddProjectBtn from "../AddProjectBtn";
import { toast } from "react-toastify";
import { useAuthStore } from "../../../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { getUserProjects } from "../../../api/project";
import {
  Box,
  Typography,
  LinearProgress,
  IconButton,

} from "@mui/material"
import "swiper/css"
import "swiper/css/navigation"
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
function Projects() {
  const { user } = useAuthStore();
  const [projects, setProjects] = useState([]);
  useEffect(() => {
    const fetchProjects = async () => {
      const res = await fetch(`${user._id}/projects`);
      const data = await res.json();
      setProjects(data);
    };

    fetchProjects();
  }, [user._id]);

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
            {/* <h2 className="mb-4 fw-bold">
              Number Of Projects : {data.results}
            </h2> */}
            {/* <h1>Omar, {user?.email}</h1> */}
          </div>
          <div className="flex justify-between mb-4">
            <h2 className="mb-4 font-bold">
              Number Of Projects : {data.results}
            </h2>

            <AddProjectBtn />
          </div>
          <div className="sliderContainer  w-[1060px]">
            {isLoading ? (
              <p>Loading...</p>
            ) : (

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-medium">All Projects</h2>
                  <div className="flex gap-2">
                    <IconButton className="slider-prev !w-8 !h-8 !border !border-[#F5F5F7] !rounded-full">
                      <ChevronLeft className="w-5 h-5" />
                    </IconButton>
                    <IconButton className="slider-next !w-8 !h-8 !border !border-[#F5F5F7] !rounded-full">
                      <ChevronRight className="w-5 h-5" />
                    </IconButton>
                  </div>
                </div>


                <Swiper
                  modules={[Navigation]}
                  spaceBetween={16}
                  slidesPerView="auto"
                  navigation={{
                    prevEl: ".slider-prev",
                    nextEl: ".slider-next",
                  }}
                  breakpoints={{
                    640: {
                      slidesPerView: 1,
                    },
                    768: {
                      slidesPerView: 2,
                    },
                    1024: {
                      slidesPerView: 2,
                    },
                  }}
                  className="upcoming-task-swiper"
                >
                  {data.doc.map((project, index) => (
                    <SwiperSlide className="!w-full sm:!w-auto">
                      <div key={index} className="bg-white p-4 rounded-xl border border-gray-200">
                        <div className="mb-3">
                          <Box
                            component="img"
                            src={cardImg}
                            alt={project.title}
                            sx={{
                              width: "320px",
                              height: 160,
                              objectFit: "cover",
                              borderRadius: 2,
                              mb: 1.5,
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="font-medium text-lg ">{project.name}</h3>
                          <p className="text-sm text-gray-500 mb-2">{project.description}</p>

                          <Box className="mb-3">
                            <Box className="flex justify-between mb-1">
                              <Typography variant="body2 text-lg">Progress</Typography>
                              <Typography variant="body2" className="text-indigo-500 text-sm">
                                %
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value="30"
                              className="!h-2 rounded-full"
                              sx={{
                                backgroundColor: "#f3f4f6",
                                "& .MuiLinearProgress-bar": {
                                  backgroundImage: "linear-gradient(to right, #818cf8, #546FFF)",
                                  borderRadius: "9999px",
                                },
                              }}
                            />
                          </Box>

                          <div className="flex justify-between items-center">
                            <div className="flex items-center gap-2">
                              <Clock className="w-6 h-6 text-gray-500" />
                              <span >30 Days Left</span>
                            </div>
                            <div className="flex -space-x-2">
                              {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="w-6 h-6 rounded-full border-2 border-white overflow-hidden">
                                  <img
                                    src={`https://thealbexgroup.com/wp-content/uploads/2020/07/app-builder-smaller.png?height=24&width=24&text=${i}`}
                                    alt="Team member"
                                    width={24}
                                    height={24}
                                    className="object-cover"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>

              </div>
            )}
          </div>


        </div>
      </div>
    </>
  );
}

export default Projects;
