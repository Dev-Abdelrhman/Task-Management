import AddProjectBtn from "../ProjectModals/AddProjectBtn";
import { useNavigate } from "react-router-dom";
import { categories } from "../../../../constants/categories";
import ProjectFilters from "./ProjectFilters";
import ProjectSection from "./ProjectSection";
import { useProjects } from "../../../../hooks/projects/useProjects";
import { useProjectFilters } from "../../../../hooks/projects/useProjectFilters";
import "swiper/css";
import "swiper/css/navigation";

function Projects() {
  const navigate = useNavigate();
  const { filters, actions } = useProjectFilters();
  const { privateProjects, publicProjects, overdueProjects, doneProjects } =
    useProjects(filters);

  const handleClick = (projectId) => {
    navigate(`/projects/ProjectDetails/${projectId}`);
  };

  return (
    <div className="bg-light dark:bg-[#080808] d-flex align-items-center">
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
