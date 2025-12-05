import { useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Button,
  Typography,
  LinearProgress,
  CircularProgress,
  Avatar,
} from "@mui/material";
import { Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useProjects } from "../../../hooks/projects/useProjects";

const RightSidebar = () => {
  const [currentDate] = useState(new Date());
  const navigate = useNavigate();
  const { projects, isLoading: projectLoading } = useProjects();

  const formatMonth = (date) => {
    return date.toLocaleString("default", { month: "long", year: "numeric" });
  };

  const getWeekDays = () => {
    const days = [];
    const start = new Date(currentDate);
    start.setDate(currentDate.getDate() - currentDate.getDay());

    for (let i = 0; i < 7; i++) {
      const date = new Date(start);
      date.setDate(start.getDate() + i);
      days.push(date);
    }
    return days;
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="2xl:flex sm:right-0 sm:top-0 h-full max-md:ml-0 max-2xl:ml-[16rem] border-l border-gray-200 dark:bg-[#080808] dark:!border-0 bg-[#F5F5F7] p-5 flex-col gap-4 sm:overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.4 }}
        className="flex flex-col lg:flex-row-reverse justify-end 2xl:flex-col gap-4"
      >
        {/* Calendar */}
        <div className="bg-[#FFFFFF] p-4 max-2xl:h-[180px] rounded-xl dark:bg-[#1a1a1a] dark:text-gray-200">
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
                      ? "bg-[#000000] text-white"
                      : "text-[#141522] dark:!text-white"
                  }`}
                >
                  <span
                    className={`text-sm font-medium ${
                      isCurrentDay
                        ? "text-white"
                        : "text-[#141522] dark:text-white"
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

        {/* Latest Project */}
        {projectLoading ? (
          <div className="flex !justify-center !items-center">
            <CircularProgress />
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="bg-[#FFFFFF] p-4 rounded-xl dark:bg-[#1a1a1a] dark:text-gray-200">
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-lg font-medium">Latest Project</h2>
            </div>
            <div className="rounded-xl overflow-hidden mb-4">
              <div className="mb-3">
                <Box
                  component="img"
                  src={
                    projects[0]?.image?.[0]?.url ||
                    "https://placehold.co/612x612?text=No+Image&font=roboto"
                  }
                  alt="Project Image"
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
                  {projects[0].name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-[#e5e7ebbb] mb-3">
                  {projects[0].category}
                </p>
                <Box className="mb-3">
                  <Box className="flex justify-between mb-1">
                    <Typography variant="body2 !text-lg !mb-1">
                      Progress
                    </Typography>
                    <Typography
                      variant="body2"
                      className=" !text-lg text-indigo-500"
                    >
                      {projects[0].progress}%
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={projects[0].progress}
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
                    <Clock className="w-6 h-6 text-gray-500 dark:text-white" />
                    <span className="text-sm">1 Hour</span>
                  </div>
                  <div className="flex -space-x-2">
                    {projects[0].members?.map((pro) => (
                      <div
                        key={pro._id}
                        className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
                      >
                        <Avatar
                          src={pro.user?.image?.[0]?.url}
                          alt="Team member"
                          className="!w-full !h-full object-cover"
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
                <span className="text-md text-gray-500 dark:text-[#e5e7ebbb]">
                  {projects[0].category}
                </span>
              </div>

              <div className="space-y-4 mb-8">
                {projects[0]?.tasks?.slice(0, 3).map((task, i) => (
                  <div key={task._id} className="flex items-center gap-2">
                    <div className="w-9 h-9 flex items-center dark:!bg-[#3a3a3a] dark:text-[#fffff] justify-center !rounded-xl min-w-9 !bg-[#F5F5F7] text-sm">
                      {i + 1}
                    </div>
                    <div className="text-sm truncate">{task.title}</div>
                  </div>
                ))}
              </div>

              <Button
                className="w-full !text-base !font-normal !capitalize !bg-[#546FFF] !text-white !py-3 !rounded-xl"
                onClick={() =>
                  navigate(`/projects/ProjectDetails/${projects[0]._id}`)
                }
              >
                Go To Project
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-[#FFFFFF] p-4 rounded-xl dark:bg-[#1a1a1a] dark:text-gray-200">
            <Typography
              variant="body2"
              className="text-gray-500 dark:text-gray-400"
            >
              No projects found
            </Typography>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default RightSidebar;
