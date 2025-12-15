import { useState } from "react";
import { Button } from "@mui/material";
import { Ellipsis } from "lucide-react";
import AddProjectBtn from "./AddProjectBtn";
import DeleteProjectModal from "./DeleteProjectModal";
import ReactDOM from "react-dom";

const ProjectOptionsMenu = ({ projectId, projectData }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  return (
    <div className="flex relative max-sm:z-40 max-sm:left-5">
      <Button
        onClick={() => setShowMenu(!showMenu)}
        className="sm:!absolute sm:!right-[-20px] max-sm:!z-40 !text-black dark:!text-white !text-lg !rounded-full !w-1 !p-0 !mx-1 !hover:bg-gray-200 dark:!hover:bg-gray-700"
      >
        <Ellipsis />
      </Button>

      {showMenu && (
        <div className="!absolute !right-0 !mx-3 !mt-8 !z-10 !w-31 !bg-white dark:!bg-[#222222] !shadow-md !rounded-[10px]">
          <Button
            onClick={() => {
              setIsEditMode(true);
              setShowMenu(false);
            }}
            className="block w-full px-3 py-2 text-sm dark:!text-white !text-gray-700 dark:hover:bg-[#333333] hover:bg-gray-100"
          >
            Edit
          </Button>
          <hr className="border-gray-200 dark:border-gray-700" />
          <Button
            onClick={() => {
              setShowDeleteModal(true);
              setShowMenu(false);
            }}
            className="block w-full py-2 text-sm !text-red-500 dark:hover:bg-[#333333] hover:bg-gray-100"
          >
            Delete
          </Button>
        </div>
      )}

      {isEditMode &&
        ReactDOM.createPortal(
          <AddProjectBtn
            isEditMode={true}
            projectToEdit={projectData}
            open={isEditMode}
            onClose={() => setIsEditMode(false)}
          />,
          document.getElementById("modal-root")
        )}

      {showDeleteModal &&
        ReactDOM.createPortal(
          <DeleteProjectModal
            projectId={projectId}
            projectData={projectData}
            onClose={() => setShowDeleteModal(false)}
          />,
          document.getElementById("modal-root")
        )}
    </div>
  );
};

export default ProjectOptionsMenu;
