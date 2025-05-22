import { useMemo } from "react";
import { DateTime } from "luxon";
import { useProjectQuery } from "./useProjectQuery";

export const useProjects = (filters = {}) => {
  const { projects, isLoading, isError, error } = useProjectQuery();
  const { searchQuery = "", selectedCategory = null, sortOrder = null } = filters;

  const filteredProjects = useMemo(() => {
    if (!projects) return [];
    let filtered = projects.filter((project) => {
      const matchesSearch = project.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory
        ? project.category === selectedCategory
        : true;
      return matchesSearch && matchesCategory;
    });

    if (sortOrder) {
      filtered = [...filtered].sort((a, b) => {
        const aDate = a.dueDate
          ? DateTime.fromISO(a.dueDate).toMillis()
          : Infinity;
        const bDate = b.dueDate
          ? DateTime.fromISO(b.dueDate).toMillis()
          : Infinity;

        if (aDate === Infinity && bDate === Infinity) return 0;
        if (aDate === Infinity) return 1;
        if (bDate === Infinity) return -1;

        return sortOrder === "asc" ? aDate - bDate : bDate - aDate;
      });
    }

    return filtered;
  }, [projects, searchQuery, selectedCategory, sortOrder]);

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

  return {
    projects,
    filteredProjects,
    privateProjects,
    publicProjects,
    overdueProjects,
    doneProjects,
    isLoading,
    isError,
    error,
  };
};