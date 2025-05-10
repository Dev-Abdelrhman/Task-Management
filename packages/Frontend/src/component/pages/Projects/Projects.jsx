import React, { useMemo, useState } from "react";
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
  Menu,
  MenuItem,
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
  Ban,
  CircleCheck,
} from "lucide-react";
import { DateTime } from "luxon";

function Projects() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);

  const categories = [
    "UI/UX",
    "Development",
    "Marketing",
    "Product Management",
    "Business Strategy",
    "Operations",
    "Sales",
    "Customer Support",
    "Finance",
    "Legal",
    "Human Resources",
    "IT Support",
    "Research & Development",
    "Data Science",
    "Machine Learning",
    "Artificial Intelligence",
    "Cybersecurity",
    "Blockchain",
    "E-commerce",
    "Supply Chain",
    "Logistics",
    "Event Management",
    "Healthcare",
    "Real Estate",
    "Education",
    "Non-Profit",
    "Construction",
    "Retail",
    "Entertainment",
    "Media & Publishing",
    "Public Relations",
    "Government",
    "Telecommunications",
    "Design",
    "Consulting",
    "Travel & Hospitality",
    "Frontend Development",
    "Backend Development",
    "Fullstack Development",
    "Quality Assurance",
    "Testing",
    "Bug Fixing",
    "DevOps",
    "Continuous Integration",
    "Deployment",
    "Cloud Computing",
    "AWS",
    "Google Cloud",
    "Azure",
    "Augmented Reality",
    "Virtual Reality",
    "AR/VR Development",
    "Internet of Things",
    "IoT Development",
    "Smart Devices",
    "Automation",
    "Robotic Process Automation (RPA)",
    "CRM Development",
    "Customer Insights",
    "CRM Integration",
    "ERP Development",
    "Enterprise Solutions",
    "Business Systems",
    "Game Development",
    "Unity Development",
    "Unreal Engine",
    "AI Ethics",
    "Ethical AI",
    "AI Regulations",
  ];

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

  const toggleSortOrder = () => {
    setSortOrder((prev) => {
      if (prev === null) return "asc";
      if (prev === "asc") return "desc";
      return null;
    });
  };

  const filteredProjects = useMemo(() => {
    if (!data?.doc) return [];
    let projects = data.doc.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? project.category === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });

    // Sort by deadline
    if (sortOrder) {
      projects = [...projects].sort((a, b) => {
        const aDate = a.dueDate
          ? DateTime.fromISO(a.dueDate).toMillis()
          : Infinity;
        const bDate = b.dueDate
          ? DateTime.fromISO(b.dueDate).toMillis()
          : Infinity;

        // Handle projects without due dates
        if (aDate === Infinity && bDate === Infinity) return 0;
        if (aDate === Infinity) return 1;
        if (bDate === Infinity) return -1;

        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      });
    }

    return projects;
  }, [data, searchQuery, selectedCategory, sortOrder]);


  const privateProjects = filteredProjects.filter(
    (project) => project.memberCount <= 1 && project.progress < 100 
  )
  const publicProjects = filteredProjects.filter(
    (project) => project.memberCount > 1 && project.progress < 100
  )
  const overdueProjects = filteredProjects.filter(
    (project) =>
      project.dueDate &&
      DateTime.fromISO(project.dueDate) < DateTime.local() &&
      project.progress < 100
  )
  const doneProjects = filteredProjects.filter(
    (project) => project.progress === 100
  )

  

  const calculateDaysLeft = (dueDateString) => {
    if (!dueDateString) return "Error";

    const now = DateTime.local();
    const dueDate = DateTime.fromISO(dueDateString).setZone("local");

    if (dueDate < now) {
      return (
        <>
          <Ban className="w-6 h-6 text-red-500" />
          <span className="text-red-500 ">Overdue</span>
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

  const dataLength = filteredProjects.length;

  const renderProjectSection = (title, projects, swiperClass) => {
    if (projects.length === 0) return null;
    return (
      <div className="bg-light d-flex align-items-center">
        <div className="px-6 py-4">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-medium dark:text-[#E0E0E0]">
              {title}
            </h2>
            <div className="flex gap-2">
              <IconButton
                className={`${swiperClass}-prev !w-10 !h-10 !border !border-[#F5F5F7] !rounded-full`}
              >
                <ChevronLeft className="!w-6 !h-6" />
              </IconButton>
              <IconButton
                className={`${swiperClass}-next !w-10 !h-10 !border !border-[#F5F5F7] !rounded-full`}
              >
                <ChevronRight className="!w-6 !h-6" />
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
                <div
                  className="bg-white p-4 dark:bg-[#1E1E1E] dark:text-white rounded-xl border border-gray-200 dark:border-gray-600 transition-shadow duration-300 hover:!shadow-lg ml-2 mb-4"
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
                        {project.progress === 100 ? (
                          <>
                            <CircleCheck className="w-6 h-6 text-green-500" />
                            <span className="text-green-500">Completed</span>
                          </>
                        ) : (
                          <>{calculateDaysLeft(project.dueDate)}</>
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
                                pro.user.image[0]?.url ||
                                "https://fakeimg.pl/600x800?text=No+Image"
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

    )
  }

  
  return (
    <>
      <div className="bg-white dark:bg-[#121212] flex justify-between items-center px-6 pt-2 pb-8 ">
        <div className="relative w-1/2">
          <span className="absolute inset-y-0 left-[2px] flex items-center pl-3 ">
            <Search className="h-5 w-5 text-[#8E92BC] " />
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
            className="!border-gray-200 !text-gray-700 !text-sm !rounded-[10px] dark:hover:!bg-[#353535] dark:!text-[#a0a0a0] !py-3 !px-6 hover:!bg-gray-50 !capitalize"
            onClick={(e) => setAnchorEl(e.currentTarget)}
          >
            {selectedCategory || "Category"}
          </Button>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={() => setAnchorEl(null)}
            PaperProps={{ style: { maxHeight: 200, overflow: "auto" } }}
          >
            <MenuItem
              onClick={() => {
                setSelectedCategory(null);
                setAnchorEl(null);
              }}
            >
              All Categories
            </MenuItem>
            {categories.map((cat) => (
              <MenuItem
                key={cat}
                onClick={() => {
                  setSelectedCategory(cat);
                  setAnchorEl(null);
                }}
              >
                {cat}
              </MenuItem>
            ))}
          </Menu>

          <Button
            variant="outlined"
            startIcon={<FilterListIcon className="!w-6 !h-6 !text-[#8E92BC]" />}
            className="!border-gray-200 !text-gray-700 !rounded-[10px] dark:!text-[#a0a0a0] dark:hover:!bg-[#353535] !py-3 !px-6 hover:!bg-gray-50 !capitalize"
            onClick={toggleSortOrder}
          >
            {sortOrder === "asc"
              ? "Deadline (Asc)"
              : sortOrder === "desc"
              ? "Deadline (Desc)"
              : "Sort By : Deadline"}
          </Button>
        </div>
      </div>

      {isLoading ? (
        <div className="flex fixed top-0 left-0 w-full h-full justify-center items-center">
          <CircularProgress />
        </div>
      ) : isError ? (
        <div className="text-center text-red-500">Error: {error.message}</div>
      ): filteredProjects.length > 0 ?(
        <>
          {renderProjectSection("Private Projects", privateProjects, "private-swiper")}
          {renderProjectSection("Public Projects", publicProjects, "public-swiper")}
          {renderProjectSection("Overdue Projects", overdueProjects, "overdue-swiper")}
          {renderProjectSection("Done Projects", doneProjects, "done-swiper")}
        </>

      ): (
      
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
