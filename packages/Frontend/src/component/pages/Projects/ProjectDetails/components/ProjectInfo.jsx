import { Users } from "lucide-react";
import DueDateStatus from "../../../../../shared/DueDateStatus";

const ProjectInfo = ({ project, onAddMembersClick }) => {
  return (
    <>
      <div className="flex flex-wrap gap-2 mb-4 ml-16">
        <p className="text-gray-500 dark:text-[#a0a0a0]">
          {project?.category} |
        </p>
        <p
          className="text-[#546FFF] cursor-pointer select-none"
          onClick={onAddMembersClick}
        >
          + Add Members
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-4 ml-16 text-black">
        <Users className="w-5 h-5 dark:text-[#a0a0a0]" />
        <p variant="body2" className="mr-5 dark:text-[#a0a0a0]">
          {project.memberCount} Members Involved
        </p>
        <div className="flex items-center gap-2 dark:text-white">
          <DueDateStatus dueDate={project?.dueDate} progress={project?.progress} />
        </div>
      </div>
    </>
  );
};

export default ProjectInfo; 