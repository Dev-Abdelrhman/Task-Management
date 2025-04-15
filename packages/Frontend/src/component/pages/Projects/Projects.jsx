import React from "react";
import "./ProjectsStyle.css";
import AddProjectBtn from "./AddProjectBtn";
import ProjectOptionsMenu from "./ProjectOptionsMenu";
import { useAuthStore } from "../../../stores/authStore";
import { useQuery } from "@tanstack/react-query";
import { getUserProjects } from "../../../api/project";
import {
  Box,
  Typography,
  LinearProgress,
  IconButton,
  Button,
  CircularProgress
} from "@mui/material"
import "swiper/css"
import "swiper/css/navigation"
import FilterListIcon from '@mui/icons-material/FilterList';
import { Swiper, SwiperSlide } from "swiper/react"
import { Navigation } from "swiper"
import {  ChartBarStacked, ChevronLeft, ChevronRight, Clock, Search } from "lucide-react";

function Projects() {
  const { user } = useAuthStore();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return await getUserProjects(user._id);
    },
  });

  if (isError) return <div>Error: {error.message}</div>;


  return (
    <>
     <div className="bg-white flex justify-between items-center px-6 pt-2 pb-8 ">
        <div className="relative w-1/2">
          <span className="absolute inset-y-0 right-6 flex items-center pl-3">
            <Search className="h-5 w-5 text-[#8E92BC]" />
          </span>
          <input
            type="search"
            className="w-full pl-10 pr-4 py-4 border border-gray-200 !rounded-[10px] focus:outline-none"
            placeholder="Search Task"
          />
        </div>
        <div className="flex justify-end gap-4 items-center mr-1">
          <AddProjectBtn />
          <Button
            variant="outlined"
            startIcon={<ChartBarStacked className="w-6 h-6 !text-[#8E92BC]" />}
            className="!border-gray-200 !text-gray-700 !text-sm !rounded-[10px] !py-3 !px-6  hover:!bg-gray-50 !capitalize"
          >
            Category
          </Button>
          <Button
            variant="outlined"
            startIcon={<FilterListIcon className="!w-6 !h-6 !text-[#8E92BC]" />}
            className="!border-gray-200 !text-gray-700 !rounded-[10px] !py-3 !px-6 hover:!bg-gray-50 !capitalize"
          >
            Sort By : Deadline
          </Button>
        </div>
      </div>
      {data.doc.length > 0 && (
        <>
      <div className="bg-light  d-flex align-items-center">
        <div className="px-6 py-4">
          <div className="d-flex justify-content-between align-items-center mt-3">
          </div>
          <div className="w-full">
          {isLoading ? (
              <div className="flex fixed top-0 left-0 w-full h-full justify-center items-center">
                <CircularProgress />
              </div>
            ) : isError ? (
              <div className="text-center text-red-500">
                Error: {error.message}
              </div>
            ) : (

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-medium">All Projects</h2>
                  <div className="flex gap-2">
                    <IconButton className="fslider-prev !w-10 !h-10 !border !border-[#F5F5F7] !rounded-full">
                      <ChevronLeft className="!w-6 !h-6" />
                    </IconButton>
                    <IconButton className="fslider-next !w-10 !h-10 !border !border-[#F5F5F7] !rounded-full">
                      <ChevronRight className="!w-6 !h-6" />
                    </IconButton>
                  </div>
                </div>


                <Swiper
                  modules={[Navigation]}
                  spaceBetween={16}
                  slidesPerView="auto"
                  navigation={{
                    prevEl: ".fslider-prev",
                    nextEl: ".fslider-next",
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
                      <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 ">
                        <div className="my-1">
                          <Box
                            component="img"
                            src={"https://thealbexgroup.com/wp-content/uploads/2020/07/app-builder-smaller.png"}
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
                          <div className="flex justify-between p-0 m-0">
                            <h3 className="font-medium text-lg !m-0 !p-0">{project.name}</h3>
                            <ProjectOptionsMenu projectId={project._id} projectData={project} />
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{project.description}</p>

                          <Box className="mb-4">
                            <Box className="flex justify-between mb-1">
                              <Typography variant="body2 text-lg !mb-1">Progress</Typography>
                              <Typography variant="body2" className="text-indigo-500 text-sm">
                                30%
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

      <div className="bg-light d-flex align-items-center !pb-2">
        <div className="px-6">
          <div className="d-flex justify-content-between align-items-center mt-3">
          </div>
          <div className="w-full">
          {isLoading ? (
              <div className="flex fixed top-0 left-0 w-full h-full justify-center items-center">
                <CircularProgress />
              </div>
            ) : isError ? (
              <div className="text-center text-red-500">
                Error: {error.message}
              </div>
            ) : (

              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-medium">All Projects</h2>
                  <div className="flex gap-2">
                    <IconButton className="sslider-prev !w-10 !h-10 !border !border-[#F5F5F7] !rounded-full">
                      <ChevronLeft className="!w-6 !h-6" />
                    </IconButton>
                    <IconButton className="sslider-next !w-10 !h-10 !border !border-[#F5F5F7] !rounded-full">
                      <ChevronRight className="!w-6 !h-6" />
                    </IconButton>
                  </div>
                </div>


                <Swiper
                  modules={[Navigation]}
                  spaceBetween={16}
                  slidesPerView="auto"
                  navigation={{
                    prevEl: ".sslider-prev",
                    nextEl: ".sslider-next",
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
                      <div key={index} className="bg-white p-4 rounded-xl border border-gray-200 ">
                        <div className="my-1">
                          <Box
                            component="img"
                            src={"https://thealbexgroup.com/wp-content/uploads/2020/07/app-builder-smaller.png"}
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
                          <div className="flex justify-between p-0 m-0">
                            <h3 className="font-medium text-lg !m-0 !p-0">{project.name}</h3>
                            <ProjectOptionsMenu projectId={project._id} projectData={project} />
                          </div>
                          <p className="text-sm text-gray-500 mb-2">{project.description}</p>

                          <Box className="mb-4">
                            <Box className="flex justify-between mb-1">
                              <Typography variant="body2 text-lg !mb-1">Progress</Typography>
                              <Typography variant="body2" className="text-indigo-500 text-sm">
                                30%
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
      )}
      {data.doc.length === 0 && (
        <div className="flex gap-5 flex-col w-full !mt-24 justify-center items-center">
          <div className="flex justify-center items-center flex-col gap-7">
          <h2 className="text-6xl font-medium text-gray-500">No projects found</h2>
          <h3 className="text-2xl text-gray-500">Add a project to get started</h3>
          <p className="text-gray-500"> clicking the button below</p>
          </div>

          <AddProjectBtn />
        </div>
      )}
    </>
  );
}

export default Projects;
