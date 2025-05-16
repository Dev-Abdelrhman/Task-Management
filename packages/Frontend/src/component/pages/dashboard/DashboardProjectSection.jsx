import React from "react";
import {
  Button,
  Box,
  IconButton,
  Typography,
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import { ChevronLeft, ChevronRight, CircleCheck, Clock, Ban } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import ProjectOptionsMenu from "../Projects/ProjectModals/ProjectOptionsMenu";
import { useProjects } from "../../../hooks/useProjects";

const DashboardProjectSection = () => {
  const navigate = useNavigate();
  const { projects, isLoading: projectLoading, isError: isProjectsError, error: projectsError } = useProjects();

  const calculateDaysLeft = (dueDateString) => {
    if (!dueDateString) return "Error";

    const now = DateTime.local();
    const dueDate = DateTime.fromISO(dueDateString).setZone("local");

    if (dueDate < now) {
      return (
        <>
          <Ban className="w-6 h-6 text-red-500" />
          <span className="text-red-500">Overdue</span>
        </>
      );
    }

    const diff = dueDate.diff(now, ["days", "hours"]);

    if (diff.days < 1) {
      return (
        <>
          <Clock className="w-6 h-6 text-gray-500" />
          <span>{Math.ceil(diff.hours)} Hours Left</span>
        </>
      );
    }

    return (
      <>
        <Clock className="w-6 h-6 text-gray-500" />
        <span>{Math.ceil(diff.days)} Days Left</span>
      </>
    );
  };

  if (projectLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <CircularProgress />
      </div>
    );
  }

  if (isProjectsError) {
    return (
      <div className="text-center text-red-500">
        Error: {projectsError.message}
      </div>
    );
  }

  if (!projects || projects.length === 0) {
    return (
      <div className="flex gap-5 flex-col w-full !mt-24 justify-center items-center">
        <div className="flex justify-center items-center flex-col gap-7">
          <h2 className="text-6xl font-medium text-gray-500">
            No projects found
          </h2>
          <h3 className="text-2xl text-gray-500">
            You can create a project by going to the projects page
          </h3>
          <p className="text-gray-500"> clicking the button below</p>
          <Button
            onClick={() => navigate("/projects")}
            className="w-52 !text-base !font-normal !capitalize !bg-[#546FFF] !text-white !py-3 !rounded-xl"
          >
            Go To Projects
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-medium dark:text-white">Latest Project</h2>
        <div className="flex gap-2">
          <IconButton className="slider-prev !w-8 !h-8 !border !border-[#F5F5F7] !rounded-full">
            <ChevronLeft className="w-5 h-5 dark:!text-[#ffff]" />
          </IconButton>
          <IconButton className="slider-next !w-8 !h-8 !border !border-[#F5F5F7] !rounded-full">
            <ChevronRight className="w-5 h-5 dark:!text-[#ffff]" />
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
            slidesPerView: 3,
          },
        }}
        className="latest-project-swiper"
      >
        {projects.slice(0, 4).map((project) => (
          <SwiperSlide key={project._id} className="!w-full sm:!w-auto">
            <div className="bg-white max-w-[350px] p-4 dark:bg-[#1a1a1a] dark:border-0 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 transition-shadow duration-300 hover:!shadow-lg ml-2 mb-4">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4 }}
                className="flex flex-col gap-4"
              >
                <div
                  className="mb-1"
                  onClick={() =>
                    navigate(`/projects/ProjectDetails/${project._id}`)
                  }
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
                    className="select-none cursor-pointer"
                  />
                </div>
              </motion.div>

              <div>
                <div className="flex justify-between p-0 m-0">
                  <h3
                    className="font-medium text-lg cursor-pointer max-w-[280px] truncate"
                    onClick={() =>
                      navigate(`/projects/ProjectDetails/${project._id}`)
                    }
                  >
                    {project.name}
                  </h3>
                  <ProjectOptionsMenu
                    projectId={project._id}
                    projectData={project}
                  />
                </div>
                <p className="text-sm text-gray-500 mb-2">{project.category}</p>

                <Box className="mb-3">
                  <Box className="flex justify-between mb-1">
                    <Typography variant="body2 text-lg">Progress</Typography>
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
                    className="!h-2 rounded-full dark:bg-[#3a3a3a]"
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
                    {project.progress === 100 ? (
                      <>
                        <CircleCheck className="w-6 h-6 text-green-500" />
                        <span className="text-green-500">Completed</span>
                      </>
                    ) : (
                      calculateDaysLeft(project.dueDate)
                    )}
                  </div>
                  <div className="flex -space-x-2">
                    {project.members?.map((pro) => (
                      <div
                        key={pro._id}
                        className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
                      >
                        <img
                          src={
                            pro.user?.image?.[0]?.url ||
                            "https://fakeimg.pl/600x800?text=No+Image"
                          }
                          alt="Team member"
                          className="object-cover select-none w-5 h-5"
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
  );
};

export default DashboardProjectSection;
