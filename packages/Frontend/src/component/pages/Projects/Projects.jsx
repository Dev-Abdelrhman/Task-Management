import React, { useMemo, useState } from "react";
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
  CircularProgress,
} from "@mui/material";
import "swiper/css";
import "swiper/css/navigation";
import FilterListIcon from "@mui/icons-material/FilterList";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { useNavigate } from "react-router-dom";
import {
  ChartBarStacked,
  ChevronLeft,
  ChevronRight,
  Clock,
  Search,
} from "lucide-react";
// import { differenceInDays, differenceInHours, parseISO } from "date-fns";
// import { format, utcToZonedTime } from "date-fns-tz";

function Projects() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return await getUserProjects(user._id);
    },
  });
  console.log(data, "data");

  const handleClick = (projectId) => {
    navigate(`/projects/ProjectDetails/${projectId}`);
  };

  const filteredProjects = useMemo(() => {
    if (!data?.doc) return [];
    return data.doc.filter((project) =>
      project.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  // const calculateDaysLeft = (dueDateString) => {
  //   if (!dueDateString) {
  //     console.error("Due date string is undefined or null");
  //     return "Error";
  //   }

  //   const currentDate = new Date();
  //   const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  //   // Interpret dueDate in the target timezone
  //   const dueDate = utcToZonedTime(dueDateString, timeZone);

  //   const timeDifference = dueDate - currentDate;

  //   const hoursLeft = Math.ceil(timeDifference / (1000 * 60 * 60));
  //   const daysLeft = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

  //   if (timeDifference < 24 * 60 * 60 * 1000) {
  //     return hoursLeft; // Return hours if within the same day
  //   }
  //   return daysLeft; // Otherwise, return days
  // };

  const dataLength = filteredProjects.length;
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
            placeholder="Search Project"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
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

      {isLoading ? (
        <div className="flex fixed top-0 left-0 w-full h-full justify-center items-center">
          <CircularProgress />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500">Error: {error.message}</div>
      ) : dataLength > 0 ? (
        <>
          <div className="bg-light  d-flex align-items-center">
            <div className="px-6 py-4">
              <div className="d-flex justify-content-between align-items-center mt-3"></div>
              <div className="w-full">
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
                    {filteredProjects.map((project, index) => (
                      <SwiperSlide className="!w-full sm:!w-auto">
                        <div
                          key={index}
                          className="bg-white p-4 rounded-xl border border-gray-200 transition-shadow duration-300 hover:!shadow-lg ml-2 mb-4"
                        >
                          <div
                            className="my-1"
                            onClick={() => handleClick(project._id)}
                          >
                            <Box
                              component="img"
                              src={
                                project?.image?.[0]?.url ||
                                "https://fakeimg.pl/1280x720?text=No+Image"
                              }
                              alt={project.title}
                              sx={{
                                width: "320px",
                                height: 160,
                                objectFit: "cover",
                                borderRadius: 2,
                                mb: 1.5,
                              }}
                              className="cursor-pointer"
                            />
                          </div>
                          <div>
                            <div className="flex justify-between p-0 m-0">
                              <h3
                                className="font-medium text-lg !m-0 !p-0 cursor-pointer"
                                onClick={() => handleClick(project._id)}
                              >
                                {project.name}
                              </h3>
                              <ProjectOptionsMenu
                                projectId={project._id}
                                projectData={project}
                              />
                            </div>
                            <p className="text-sm text-gray-500 mb-2">
                              {project.description}
                            </p>

                            <Box className="mb-4">
                              <Box className="flex justify-between mb-1">
                                <Typography variant="body2 text-lg !mb-1">
                                  Progress
                                </Typography>
                                <Typography
                                  variant="body2"
                                  className="text-indigo-500 text-sm"
                                >
                                  {project.progress}%
                                </Typography>
                              </Box>
                              <LinearProgress
                                variant="determinate"
                                value={project.progress}
                                className="!h-2 rounded-full"
                                sx={{
                                  backgroundColor: "#f3f4f6",
                                  "& .MuiLinearProgress-bar": {
                                    backgroundImage:
                                      "linear-gradient(to right, #818cf8, #546FFF)",
                                    borderRadius: "9999px",
                                  },
                                }}
                              />
                            </Box>

                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <Clock className="w-6 h-6 text-gray-500" />
                                <span>
                                  {/* {console.log(project)}
                                  {calculateDaysLeft(project.dueDate)} Days Left */}
                                  Days Left
                                </span>
                              </div>
                              <div className="flex -space-x-2">
                                {[1, 2, 3, 4, 5].map((i) => (
                                  <div
                                    key={i}
                                    className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
                                  >
                                    <img
                                      src={`https://fakeimg.pl/1280x720?text=No+Image?height=24&width=24&text=${i}`}
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
              </div>
            </div>
          </div>

          <div className="bg-light d-flex align-items-center !pb-2">
            <div className="px-6">
              <div className="d-flex justify-content-between align-items-center mt-3"></div>
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
                          <div
                            key={index}
                            className="bg-white p-4 rounded-xl border border-gray-200 transition-shadow duration-300 hover:hover:!shadow-lg ml-2 mb-4"
                            onClick={() => handleClick(project._id)}
                          >
                            <div className="my-1">
                              <Box
                                component="img"
                                src={
                                  project?.image?.[0]?.url ||
                                  "https://fakeimg.pl/1280x720?text=No+Image"
                                }
                                alt={project.title}
                                sx={{
                                  width: "320px",
                                  height: 160,
                                  objectFit: "cover",
                                  borderRadius: 2,
                                  mb: 1.5,
                                }}
                                className="cursor-pointer"
                              />
                            </div>
                            <div>
                              <div className="flex justify-between p-0 m-0">
                                <h3 className="font-medium text-lg !m-0 !p-0 cursor-pointer">
                                  {project.name}
                                </h3>
                                <ProjectOptionsMenu
                                  projectId={project._id}
                                  projectData={project}
                                />
                              </div>
                              <p className="text-sm text-gray-500 mb-2">
                                {project.description}
                              </p>

                              <Box className="mb-4">
                                <Box className="flex justify-between mb-1">
                                  <Typography variant="body2 text-lg !mb-1">
                                    Progress
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    className="text-indigo-500 text-sm"
                                  >
                                    {project.progress}%
                                  </Typography>
                                </Box>
                                <LinearProgress
                                  variant="determinate"
                                  value={project.progress}
                                  className="!h-2 rounded-full"
                                  sx={{
                                    backgroundColor: "#f3f4f6",
                                    "& .MuiLinearProgress-bar": {
                                      backgroundImage:
                                        "linear-gradient(to right, #818cf8, #546FFF)",
                                      borderRadius: "9999px",
                                    },
                                  }}
                                />
                              </Box>

                              <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                  <Clock className="w-6 h-6 text-gray-500" />
                                  <span>
                                    {/* {calculateDaysLeft(project.dueDate)} Days */}
                                    Days Left
                                  </span>
                                </div>
                                <div className="flex -space-x-2">
                                  {[1, 2, 3, 4, 5].map((i) => (
                                    <div
                                      key={i}
                                      className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
                                    >
                                      <img
                                        src={`https://fakeimg.pl/1280x720?text=No+Image?height=24&width=24&text=${i}`}
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
      ) : (
        <div className="flex gap-5 flex-col w-full !mt-24 justify-center items-center">
          <div className="flex justify-center items-center flex-col gap-7">
            <h2 className="text-6xl font-medium text-gray-500">
              No projects found
            </h2>
            <h3 className="text-2xl text-gray-500">
              Add a project to get started
            </h3>
            <p className="text-gray-500"> clicking the button below</p>
          </div>
          <AddProjectBtn />
        </div>
      )}
    </>
  );
}

export default Projects;
