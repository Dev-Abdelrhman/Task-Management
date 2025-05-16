import React, { useMemo, useState, useEffect } from "react";
import AddProjectBtn from "../ProjectModals/AddProjectBtn";
import ProjectOptionsMenu from "../ProjectModals/ProjectOptionsMenu";
import { useAuthStore } from "../../../../stores/authStore";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getUserProjects } from "../../../../api/project";

import "swiper/css";
import "swiper/css/navigation";
import { useNavigate } from "react-router-dom";
import { Clock, Ban } from "lucide-react";
import { DateTime } from "luxon";
import socket from "../../../../utils/socket";
import ProjectFilters from "./ProjectFilters";
import ProjectSection from "./ProjectSection";
import { categories } from "../../../../constants/categories";

function Projects() {
  const { user } = useAuthStore();
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState(null);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["projects"],
    queryFn: async () => {
      return await getUserProjects(user._id);
    },
  });

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
  );
  const publicProjects = filteredProjects.filter(
    (project) => project.memberCount > 1 && project.progress < 100
  );
  const overdueProjects = filteredProjects.filter(
    (project) =>
      project.dueDate &&
      DateTime.fromISO(project.dueDate) < DateTime.local() &&
      project.progress < 100
  );
  const doneProjects = filteredProjects.filter(
    (project) => project.progress === 100
  );

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
          <Clock className="w-6 h-6 text-gray-500 dark:!text-white" />
          <span>{Math.ceil(diff.hours)} Hours Left</span>
        </>
      );
    }

    return (
      <>
        <Clock className="w-6 h-6 text-gray-500 dark:!text-white" />
        <span>{Math.ceil(diff.days)} Days Left</span>
      </>
    );
  };

  const dataLength = filteredProjects.length;

  useEffect(() => {
    if (!user) return;

    const handleProjectCreated = (newProject) => {
      queryClient.setQueryData(["projects"], (old) => {
        if (!old?.doc) return { doc: [newProject] };
        return {
          ...old,
          doc: [...old.doc, newProject],
        };
      });
    };

    const handleProjectUpdated = (updatedProject) => {
      queryClient.setQueryData(["projects"], (old) => {
        if (!old?.doc) return old;
        return {
          ...old,
          doc: old.doc.map((project) =>
            project._id === updatedProject._id ? updatedProject : project
          ),
        };
      });
    };

    const handleProjectDeleted = (deletedId) => {
      queryClient.setQueryData(["projects"], (old) => {
        if (!old?.doc) return old;
        return {
          ...old,
          doc: old.doc.filter((project) => project._id !== deletedId),
        };
      });
    };

    socket.on("project-created", handleProjectCreated);
    socket.on("project-updated", handleProjectUpdated);
    socket.on("project-deleted", handleProjectDeleted);

    return () => {
      socket.off("project-created", handleProjectCreated);
      socket.off("project-updated", handleProjectUpdated);
      socket.off("project-deleted", handleProjectDeleted);
    };
  }, [user, queryClient]);

  return (
    <div className="bg-light dark:bg-[#080808] d-flex align-items-center">
      <ProjectFilters
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        sortOrder={sortOrder}
        toggleSortOrder={toggleSortOrder}
        categories={categories}
        AddProjectBtn={<AddProjectBtn />}
      />

      <ProjectSection
        title="Private Projects"
        projects={privateProjects}
        handleClick={handleClick}
        swiperClass="private-projects"
      />

      <ProjectSection
        title="Public Projects"
        projects={publicProjects}
        handleClick={handleClick}
        swiperClass="public-projects"
      />

      <ProjectSection
        title="Overdue Projects"
        projects={overdueProjects}
        handleClick={handleClick}
        swiperClass="overdue-projects"
      />

      <ProjectSection
        title="Done Projects"
        projects={doneProjects}
        handleClick={handleClick}
        swiperClass="done-projects"
      />
    </div>
  );
}

export default Projects;
