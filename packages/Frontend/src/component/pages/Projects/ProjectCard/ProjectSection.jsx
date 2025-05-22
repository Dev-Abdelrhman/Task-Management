import { Box, IconButton, Typography, LinearProgress } from "@mui/material";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper";
import {
  ChevronLeft,
  ChevronRight,
  CircleCheck,
  Clock,
  Ban,
} from "lucide-react";
import ProjectOptionsMenu from "../ProjectModals/ProjectOptionsMenu";
import DueDateStatus from "../../../../shared/DueDateStatus";

function ProjectSection({ title, projects, handleClick, swiperClass }) {
  if (projects.length === 0) return null;

  return (
    <div className="bg-light dark:bg-[#080808] d-flex align-items-center">
      <div className="px-6 py-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-medium dark:text-[#E0E0E0]">{title}</h2>
          <div className="flex gap-2">
            <IconButton
              className={`${swiperClass}-prev !w-10 !h-10 !border !border-[#F5F5F7] !rounded-full`}
            >
              <ChevronLeft className="!w-6 !h-6 dark:!text-[#ffff]" />
            </IconButton>
            <IconButton
              className={`${swiperClass}-next !w-10 !h-10 !border !border-[#F5F5F7] !rounded-full`}
            >
              <ChevronRight className="!w-6 !h-6 dark:!text-[#ffff]" />
            </IconButton>
          </div>
        </div>
        <Swiper
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView="auto"
          navigation={{
            prevEl: `.${swiperClass}-prev`,
            nextEl: `.${swiperClass}-next`,
          }}
          breakpoints={{
            640: { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            1024: { slidesPerView: 2 },
          }}
          className="upcoming-task-swiper"
        >
          {projects.map((project, index) => (
            <SwiperSlide key={index} className="!w-full sm:!w-auto">
              <div className="bg-white p-4 dark:bg-[#1a1a1a] dark:border-0 dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 transition-shadow duration-300 hover:!shadow-lg ml-2 mb-4">
                <div className="my-1" onClick={() => handleClick(project._id)}>
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
                    className="cursor-pointer select-none"
                  />
                </div>
                <div>
                  <div className="flex justify-between p-0 m-0">
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
                  <p className="text-sm text-gray-500 dark:text-[#a0a0a0] mb-2">
                    {project.category}
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
                        <DueDateStatus
                          dueDate={project.dueDate}
                          progress={project.progress}
                        />
                      )}
                    </div>
                    <div className="flex -space-x-2">
                      {project.members.map((pro) => (
                        <div
                          key={pro._id}
                          className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
                        >
                          <img
                            src={
                              Array.isArray(pro.user.image) &&
                              pro.user.image.length > 0 &&
                              pro.user.image[0]?.url
                                ? pro.user.image[0].url
                                : "https://fakeimg.pl/600x800?text=No+Image"
                            }
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
    </div>
  );
}

export default ProjectSection;
