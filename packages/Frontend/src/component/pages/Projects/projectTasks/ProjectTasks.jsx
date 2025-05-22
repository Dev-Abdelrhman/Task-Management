import { useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { Search } from "lucide-react";
import { useAuth } from "../../../../hooks/auth/useAuth";
import { Button } from "@mui/material";
import AddProjectTask from "../ProjectModals/AddProjectTask";
import ProjectTasksDetails from "./ProjectTasksDetails";
import TaskColumn from "./TaskColumn";
import DeleteTaskModal from "../ProjectModals/DeleteTaskModal";
import { useTaskManagement } from "../../../../hooks/tasks/useTaskManagement";
import { useBoardManagement } from "../../../../hooks/boards/useBoardManagement";

const ProjectTasks = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);

  const {
    data,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    editTask,
    setEditTask,
    detailsModal,
    setDetailsModal,
    deleteModal,
    setDeleteModal,
    isDeleting,
    handleAddTask,
    handleDeleteTask,
    handleFetchTaskDetails,
    updateMutation,
  } = useTaskManagement(user?._id, projectId);

  const { board, handleDragEnd } = useBoardManagement(
    data,
    searchTerm,
    (taskId, newStatus) => {
      if (user?._id && taskId && !taskId.startsWith("temp-")) {
        updateMutation.mutate({ taskId, taskData: { status: newStatus } });
      }
    }
  );

  const handleTaskClick = (task) => {
    handleFetchTaskDetails(task._id);
  };

  const openAddTaskModal = (columnId) => {
    setSelectedColumn(columnId);
    setEditTask(null);
    setShowModal(true);
  };

  const openEditTaskModal = (task) => {
    setEditTask(task);
    setSelectedColumn(null);
    setShowModal(true);
  };

  const handleEditTask = (task) => {
    setDetailsModal({ show: false, task: null });
    setEditTask(task);
    setShowModal(true);
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-screen">
        Please log in to access tasks
      </div>
    );
  if (isError)
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <>
      <div className="px-5 pb-5 pt-0 bg-white dark:bg-[#080808] flex justify-between items-center">
        <div className="relative w-1/2">
          <span className="absolute inset-y-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-[#8E92BC]" />
          </span>
          <input
            type="search"
            className="w-full pl-10 dark:text-white pr-4 py-4 dark:bg-[#3a3a3a] dark:border-[#3a3a3a] border border-gray-200 !rounded-[10px] focus:outline-none"
            placeholder="Search Project"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => openAddTaskModal()}
          className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
        >
          Add Task
        </Button>
      </div>

      <div className="px-4 pb-4 pt-4 bg-gray-100 dark:bg-[#080808] min-h-screen rounded-[30px]">
        {detailsModal.show && (
          <ProjectTasksDetails
            task={detailsModal.task}
            onClose={() => setDetailsModal({ show: false, task: null })}
            onEdit={() => handleEditTask(detailsModal.task)}
            onDelete={() => handleDeleteTask(detailsModal.task._id)}
          />
        )}

        {showModal && (
          <AddProjectTask
            closeModal={() => {
              setShowModal(false);
              setEditTask(null);
            }}
            onAddTask={handleAddTask}
            editTask={editTask}
          />
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-8 overflow-x-auto pb-4 px-4">
            {board.columns.map((column) => (
              <TaskColumn
                key={column.id}
                column={column}
                onAddTask={openAddTaskModal}
                onTaskClick={handleTaskClick}
                onTaskDelete={(taskId) =>
                  setDeleteModal({ show: true, taskId })
                }
                onTaskEdit={openEditTaskModal}
              />
            ))}
          </div>
        </DragDropContext>

        {deleteModal.show && (
          <DeleteTaskModal
            onClose={() => setDeleteModal({ show: false, taskId: null })}
            onDelete={() => handleDeleteTask(deleteModal.taskId)}
            isDeleting={isDeleting}
          />
        )}
      </div>
    </>
  );
};

export default ProjectTasks;
