import AddProjectBtn from "./ProjectModals/AddProjectBtn";
import { useNavigate } from "react-router-dom";
import { categories } from "@/constants/categories";
import ProjectFilters from "./components/ProjectFilters";
import ProjectSection from "./components/ProjectSection";
import { useProjects } from "@/hooks/projects/useProjects";
import { useProjectFilters } from "./hooks/useProjectFilters";
import "swiper/css";
import "swiper/css/navigation";
import { getNavTitle } from "@/lib/getNavTitle";

function Projects() {
  const navigate = useNavigate();
  const { filters, actions } = useProjectFilters();
  const { privateProjects, publicProjects, overdueProjects, doneProjects } =
    useProjects(filters);

  const handleClick = (projectId) => {
    navigate(`/projects/ProjectDetails/${projectId}`);
  };
  const path = window.location.pathname;
  const title = getNavTitle(path);

  return (
    <div className="bg-light dark:bg-[#080808]">
      <h4 className="sm:hidden text-3xl px-6 py-3 dark:bg-[#080808] dark:text-white bg-white">
        {title}
      </h4>

      <ProjectFilters
        categories={categories}
        AddProjectBtn={<AddProjectBtn />}
        filters={filters}
        actions={actions}
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
