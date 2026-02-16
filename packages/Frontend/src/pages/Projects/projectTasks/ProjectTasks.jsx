import { useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext } from "react-beautiful-dnd";
import { Search } from "lucide-react";
import { useAuth } from "../../../hooks/auth/useAuth";
import { Button } from "@mui/material";
import AddProjectTask from "../ProjectModals/AddProjectTask";
import ProjectTasksDetails from "./ProjectTasksDetails";
import TaskColumn from "./TaskColumn";
import DeleteTaskModal from "../ProjectModals/DeleteTaskModal";
import { useTaskManagement } from "../../../hooks/tasks/useTaskManagement";
import { useBoardManagement } from "../../../hooks/boards/useBoardManagement";
import { getNavTitle } from "../../../lib/getNavTitle";

const ProjectTasks = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [addTaskStatus, setAddTaskStatus] = useState(null);

  const path = window.location.pathname;
  const title = getNavTitle(path);

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
      if (user?._id && taskId) {
        updateMutation.mutate({ taskId, taskData: { status: newStatus } });
      }
    },
  );

  const handleTaskClick = (task) => {
    handleFetchTaskDetails(task._id);
  };

  const openAddTaskModal = (columnId) => {
    setSelectedColumn(columnId);
    setEditTask(null);
    let statusValue = null;
    if (columnId === "todo") statusValue = "Todo";
    else if (columnId === "in-progress") statusValue = "In Progress";
    else if (columnId === "done") statusValue = "Completed";
    else if (columnId === "backlog") statusValue = "Pending";
    setAddTaskStatus(statusValue);
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

  const handleAddTaskSuccess = async (formData) => {
    const success = await handleAddTask(formData);
    if (success) {
      setShowModal(false);
      setEditTask(null);
      setAddTaskStatus(null);
    }
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
      <div className="px-3 sm:px-5 pb-5 pt-0 bg-white dark:bg-[#080808] flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-stretch sm:items-center">
        <h4 className="sm:hidden text-3xl px-6 py-1 dark:bg-[#080808] dark:text-white bg-white">
          {title}
        </h4>
        <div className="relative w-full sm:w-1/2">
          <span className="absolute inset-y-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-[#8E92BC]" />
          </span>
          <input
            type="search"
            className="w-full pl-10 dark:text-white pr-4 py-3 sm:py-4 dark:bg-[#3a3a3a] dark:border-[#3a3a3a] border border-gray-200 !rounded-[10px] focus:outline-none"
            placeholder="Search Project"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => openAddTaskModal()}
          className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl w-full sm:w-auto"
        >
          Add Task
        </Button>
      </div>

      <div className="px-2 sm:px-4 pb-4 pt-4 bg-gray-100 dark:bg-[#080808] min-h-screen rounded-[30px] overflow-x-hidden w-full max-w-full">
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
              setAddTaskStatus(null);
            }}
            onAddTask={handleAddTaskSuccess}
            editTask={editTask}
            statusFromColumn={addTaskStatus}
          />
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 pb-4 px-2 sm:px-4">
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
