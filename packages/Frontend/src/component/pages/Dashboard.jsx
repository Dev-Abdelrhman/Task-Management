import Sidebar from "../../shared/Sidebar";
import React, { useState, useEffect } from "react";
import {
  Bell,
  ChevronRight,
  Clock,
  MoreHorizontal,
  Mail,
  ChevronLeft,
} from "lucide-react";
import {
  Button,
  Box,
  IconButton,
  Typography,
  LinearProgress,
  Badge,
  MenuItem,
  Menu,
  Avatar,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores/authStore";
import "swiper/css";
import "swiper/css/navigation";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import { useQuery } from "@tanstack/react-query";
import { getUserProjects } from "../../api/project";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getAllUserTasks } from "../../api/user_tasks";
import ProjectOptionsMenu from "./Projects/ProjectOptionsMenu";
export default function TaskordDashboard() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user } = useAuthStore();
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const {
    data: ProjectData,
    isLoading: porjectLoding,
    isError: isProjectsError,
    error: projectsError,
  } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return await getUserProjects(user._id);
    },
  });

  const {
    data: tasksData,
    isLoading: isTasksLoading,
    isError: isTasksError,
    error: tasksError,
  } = useQuery({
    queryKey: ["tasks"],
    queryFn: getAllUserTasks,
  });

  console.log(tasksData, "TaskData");
  console.log(ProjectData, "ProjectData");
  console.log(user, "UserData");

  const totalTasks = tasksData?.results || 0;
  const doneTasks =
    tasksData?.doc?.filter((task) => task.status === "Completed")?.length || 0;
  const ramainingTasks = totalTasks - doneTasks;
  const persentage = Math.floor(
    totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0
  );

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const hostGoogleImage = (url) => {
    return `https://images.weserv.nl/?url=${encodeURIComponent(
      url
    )}&w=200&h=200`;
  };

  const [currentDate, setCurrentDate] = React.useState(new Date());

  const getWeekDays = () => {
    const today = new Date();
    const days = [];
    const start = new Date(today);
    start.setDate(today.getDate() - today.getDay()); // Start from Sunday

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const formatMonth = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  useEffect(() => {
    // Handle division by zero case
    const targetValue = totalTasks > 0 ? persentage : 0;

    const animation = setInterval(() => {
      setProgress((prev) => {
        if (prev >= targetValue) {
          clearInterval(animation);
          return targetValue;
        }
        return Math.min(prev + 1, targetValue); // Increment by 1% each frame
      });
    }, 20); // Adjust speed by changing interval duration

    return () => clearInterval(animation); // Cleanup on unmount
  }, [persentage, totalTasks]);

  return (
    <>
      <div className="flex min-h-screen bg-[#FAFAFA] dark:bg-[#121212]">
        <Sidebar />
        {/* Main Content */}
        <div className="md:ml-[16rem] flex-1 h-full w-full p-8 2xl:pr-[490px]">
          {/* Nav */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl dark:text-white">Hi, {user.name}</h1>
              <p className="text-gray-600 dark:text-[#a0a0a0]">
                Let's finish your task today!
              </p>
            </div>
            <div className="flex items-center gap-4 ">
              <IconButton
                sx={{
                  border: 1,
                }}
                size="large"
                color="inherit"
                className="w-12 h-12 !border !border-[#F5F5F7]"
              >
                <Badge badgeContent={1} color="error">
                  <Mail className="text-[#8E92BC]" />
                </Badge>
              </IconButton>
              <IconButton
                sx={{
                  border: 1,
                }}
                className="relative w-12 h-12 !border !border-[#F5F5F7] !rounded-full"
              >
                <Badge badgeContent={1} color="error">
                  <Bell className="text-[#8E92BC]" />
                </Badge>
              </IconButton>
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      className="!w-12 !h-12 select-none"
                      src={
                        user.image.length
                          ? hostGoogleImage(user.image[0].url)
                          : undefined
                      }
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "53px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    key="logout"
                    onClick={handleLogout}
                    disabled={porjectLoding}
                  >
                    <Typography sx={{ textAlign: "center" }}>Logout</Typography>
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            <div className="grid grid-cols-1 md:grid-cols-[220px_1fr] gap-6 mb-8">
              {/* Running Task */}
              <div className="h-[250px] relative flex flex-col gap-4 bg-[#111827] text-white p-6 rounded-xl">
                <div>
                  <h2 className="text-lg">Running Task</h2>
                </div>
                <div className="text-4xl font-simi mb-4">{ramainingTasks}</div>
                <div className="flex items-center justify-between md:justify-start absolute bottom-6">
                  <div className="relative w-24 h-24">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-2xl">
                          <span className="font-light">{persentage}%</span>
                        </div>
                      </div>
                    </div>
                    <CircularProgress
                      variant="determinate"
                      value={100}
                      size={90}
                      thickness={2}
                      sx={{ color: "#1F2937", position: "absolute" }}
                      className="absolute bottom-0"
                    />
                    <CircularProgress
                      variant="determinate"
                      value={progress}
                      size={90}
                      thickness={2}
                      className="absolute bottom-0"
                      sx={{
                        color: "#4F46E5",
                        background: "transparent",
                        "& .MuiCircularProgress-circle": {
                          strokeLinecap: "round",
                        },
                      }}
                    />
                  </div>
                  <div className="text-center md:ml-2">
                    <div className="text-2xl font-normal">{totalTasks}</div>
                    <div className="text-gray-400">Task</div>
                  </div>
                </div>
              </div>

              {/* Activity */}
              <div className="h-[250px] bg-white p-6 rounded-xl border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-medium">Activity</h2>
                  <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1 rounded-md">
                    <span>This Week</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
                <div className="relative h-[calc(100%-60px)]">
                  {/* Activity Chart */}
                  <div className="absolute top-1/4 left-1/4 bg-blue-500 w-3 h-3 rounded-full z-10"></div>
                  <div className="absolute top-1/4 left-1/4 bg-blue-100 w-5 h-5 rounded-full"></div>
                  <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-full bg-gray-900 text-white px-2 py-1 rounded text-xs">
                    2 Task
                  </div>

                  <svg
                    className="w-full h-full"
                    viewBox="0 0 300 100"
                    preserveAspectRatio="none"
                  >
                    <path
                      d="M0,50 C20,30 40,70 60,30 C80,10 100,50 120,60 C140,70 160,40 180,50 C200,60 220,50 240,55 C260,60 280,55 300,55"
                      fill="none"
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                    <path
                      d="M0,50 C20,30 40,70 60,30 C80,10 100,50 120,60 C140,70 160,40 180,50 C200,60 220,50 240,55 C260,60 280,55 300,55"
                      fill="none"
                      stroke="#111827"
                      strokeWidth="2"
                    />
                  </svg>
                  <div className="flex justify-between text-xs text-gray-500 mt-2">
                    <div>S</div>
                    <div>M</div>
                    <div>T</div>
                    <div>W</div>
                    <div>T</div>
                    <div>F</div>
                    <div>S</div>
                  </div>
                  <div className="absolute left-0 top-0 grid grid-rows-3 h-full text-xs text-gray-500">
                    <div>3</div>
                    <div>2</div>
                    <div>1</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Latest Project */}

          {porjectLoding ? (
            <div className="flex fixed top-0 left-0 w-full h-full justify-center items-center">
              <CircularProgress />
            </div>
          ) : isProjectsError ? (
            <div className="text-center text-red-500">
              Error: {error.message}
            </div>
          ) : ProjectData?.doc?.length > 0 ? (
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-medium dark:text-white">
                  Latest Project
                </h2>
                <div className="flex gap-2">
                  <IconButton className="slider-prev !w-8 !h-8 !border !border-[#F5F5F7] !rounded-full">
                    <ChevronLeft className="w-5 h-5 dark:text-gray-500" />
                  </IconButton>
                  <IconButton className="slider-next !w-8 !h-8 !border !border-[#F5F5F7] !rounded-full">
                    <ChevronRight className="w-5 h-5 dark:text-gray-500" />
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
                {ProjectData?.doc?.slice(0, 4).map((project, index) => (
                  <SwiperSlide key={project.id} className="!w-full sm:!w-auto">
                    <div className="bg-white max-w-[350px] p-4 dark:bg-[#1E1E1E] dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 transition-shadow duration-300 hover:!shadow-lg ml-2 mb-4">
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
                        <div className="flex  justify-between p-0 m-0">
                          <h3
                            className="font-medium text-lg cursor-pointer max-w-[280px] truncate"
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
                          {project.category}
                        </p>

                        <Box className="mb-3">
                          <Box className="flex justify-between mb-1">
                            <Typography variant="body2 text-lg">
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
                            <span>{project.daysLeft} Days Left</span>
                          </div>
                          <div className="flex -space-x-2">
                            {project.members.map((pro) => (
                              <div
                                key={pro._id}
                                className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
                              >
                                <img
                                  src={
                                    pro.user.image[0]?.url ||
                                    "https://fakeimg.pl/600x800?text=No+Image"
                                  } // default image
                                  alt="Team member"
                                  width={24}
                                  height={24}
                                  className="object-cover select-none"
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
          ) : (
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
          )}
        </div>

        {/* Right Sidebar */}
        <div className="hidden 2xl:flex fixed right-0 top-0 h-full w-[420px] border-l border-gray-200 bg-[#F5F5F7] p-5 flex-col gap-4 overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="flex flex-col gap-4"
          >
            {/* Calendar */}
            <div className="bg-[#FFFFFF] p-4 rounded-xl">
              <div className="flex justify-center items-center mb-2">
                <h2 className="text-lg mb-2">{formatMonth(currentDate)}</h2>
              </div>

              <div className="grid grid-cols-7 gap-2 text-center">
                {getWeekDays().map((date, index) => {
                  const isCurrentDay = isToday(date);
                  return (
                    <div
                      key={index}
                      className={`relative flex flex-col gap-3 items-center justify-center w-11 h-full rounded-full p-2 ${
                        isCurrentDay
                          ? "bg-[#141522] text-white"
                          : "text-[#141522]"
                      }`}
                    >
                      <span
                        className={`text-sm font-medium ${
                          isCurrentDay ? "text-white" : "text-[#141522]"
                        }`}
                      >
                        {["S", "M", "T", "W", "T", "F", "S"][date.getDay()]}
                      </span>
                      <span
                        className={`text-sm px-[11px] py-[7px] rounded-full ${
                          isCurrentDay
                            ? "bg-[#546FFF] text-white"
                            : "text-[#141522] bg-[#F5F5F7]"
                        }`}
                      >
                        {date.getDate()}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Task Today */}
            {porjectLoding ? (
              <div className="flex fixed top-0 left-0 w-full h-full justify-center items-center">
                <CircularProgress />
              </div>
            ) : isProjectsError ? (
              <div className="text-center text-red-500">
                Error: {projectsError.message}
              </div>
            ) : (
              ProjectData?.doc?.length > 0 && (
                <div className="bg-[#FFFFFF] p-4 rounded-xl">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-medium">Latest Project</h2>
                    <button>
                      <MoreHorizontal className="w-5 h-5 text-[#141522]" />
                    </button>
                  </div>

                  <div className="rounded-xl overflow-hidden mb-4">
                    <div className="mb-3">
                      <Box
                        component="img"
                        src={
                          ProjectData?.doc[0]?.image?.[0]?.url ||
                          "https://fakeimg.pl/1280x720?text=No+Image"
                        }
                        alt="Albex 360 Mockup"
                        sx={{
                          width: "100%",
                          height: 160,
                          objectFit: "cover",
                          borderRadius: 2,
                          mb: 1.5,
                        }}
                        className="select-none"
                      />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1 truncate">
                        {ProjectData.doc[0].name}
                      </h3>
                      <p className="text-sm text-gray-500 mb-3">
                        {ProjectData.doc[0].category}
                      </p>
                      {/* {console.log(ProjectData)} */}
                      <Box className="mb-3">
                        <Box className="flex justify-between mb-1">
                          <Typography variant="body2 !text-lg ">
                            Progress
                          </Typography>
                          <Typography
                            variant="body2"
                            className=" !text-lg text-indigo-500"
                          >
                            {ProjectData.doc[0].progress}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={ProjectData.doc[0].progress}
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
                          <span className="text-sm">1 Hour</span>
                        </div>
                        <div className="flex -space-x-2">
                          {ProjectData.doc[0].members.map((pro) => (
                            <div
                              key={pro._id}
                              className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
                            >
                              <img
                                src={
                                  pro.user.image[0]?.url ||
                                  "https://fakeimg.pl/600x800?text=No+Image"
                                } // default image
                                alt="Team member"
                                width={24}
                                height={24}
                                className="object-cover select-none"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <hr className="my-6 bg-[#F5F5F7]" />
                  {/* Detail Task */}
                  <div>
                    <div className="flex justify-between items-center mb-3">
                      <h2 className="text-lg font-medium">Project Task</h2>
                      <span className="text-md text-gray-500">
                        {ProjectData.doc[0].category}
                      </span>
                    </div>
                    {/* {console.log(ProjectData.doc[0].tasks)} */}

                    <div className="space-y-4 mb-8">
                      {ProjectData?.doc[0]?.tasks.slice(0, 3).map((task, i) => (
                        <div key={task._id} className="flex items-center gap-2">
                          <div className="w-9 h-9 flex items-center justify-center !rounded-xl min-w-9 !bg-[#F5F5F7] text-sm">
                            {i + 1}
                          </div>
                          <div className="text-sm truncate">{task.title}</div>
                        </div>
                      ))}
                    </div>

                    <Button
                      className="w-full !text-base !font-normal !capitalize !bg-[#546FFF] !text-white !py-3 !rounded-xl"
                      onClick={() =>
                        navigate(
                          `/projects/ProjectDetails/${ProjectData.doc[0]._id}`
                        )
                      }
                    >
                      Go To Project
                    </Button>
                  </div>
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </>
  );
}
