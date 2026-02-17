import { useState } from "react";
import { DragDropContext } from "react-beautiful-dnd";
import { Search } from "lucide-react";
import AddTask from "./components/AddTask";
import { Button } from "@mui/material";
import TaskColumn from "../Projects/projectTasks/TaskColumn";
import DeleteTaskModal from "../Projects/ProjectModals/DeleteTaskModal";
import ProjectTasksDetails from "../Projects/projectTasks/ProjectTasksDetails";
import { useUserTaskManagement } from "./hooks/useUserTaskManagement";
import { useUserBoardManagement } from "../../hooks/boards/useUserBoardManagement";
import { getNavTitle } from "../../lib/getNavTitle";

const statusMap = {
  backlog: "Pending",
  todo: "Todo",
  "in-progress": "In Progress",
  done: "Completed",
};

export default function AllTasks() {
  const {
    data,
    isLoading,
    isError,
    error,
    searchTerm,
    setSearchTerm,
    showModal,
    setShowModal,
    deleteModal,
    setDeleteModal,
    setSelectedColumn,
    isDeleting,
    editingTask,
    setEditingTask,
    taskDetailsModal,
    setTaskDetailsModal,
    handleTaskClick,
    handleAddTask,
    handleDeleteTask,
    updateMutation,
  } = useUserTaskManagement();

  const { board, handleDragEnd } = useUserBoardManagement(
    data,
    searchTerm,
    (taskId, newStatus) => {
      if (taskId && !taskId.startsWith("temp-")) {
        updateMutation.mutate({
          id: taskId,
          updates: { status: newStatus },
        });
      }
    },
  );

  const [addTaskStatus, setAddTaskStatus] = useState(null);

  const path = window.location.pathname;
  const title = getNavTitle(path);

  const openAddTaskModal = (columnId) => {
    setSelectedColumn(columnId);
    setEditingTask(null);
    let statusValue = null;
    if (columnId === "todo") statusValue = "Todo";
    else if (columnId === "in-progress") statusValue = "In Progress";
    else if (columnId === "done") statusValue = "Completed";
    else if (columnId === "backlog") statusValue = "Pending";
    setAddTaskStatus(statusValue);
    setShowModal(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setSelectedColumn(
      Object.keys(statusMap).find((key) => statusMap[key] === task.status),
    );
    setShowModal(true);
  };

  const handleEditTaskFromDetails = (task) => {
    setTaskDetailsModal({ show: false, task: null });
    openEditTaskModal(task);
  };

  const handleDeleteTaskFromDetails = (taskId) => {
    setTaskDetailsModal({ show: false, task: null });
    setDeleteModal({ show: true, taskId });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
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
      <h4 className="sm:hidden text-3xl px-6 py-3 dark:bg-[#080808] dark:text-white bg-white">
        {title}
      </h4>
      <div className="px-3 sm:px-5 pb-5 pt-0 bg-white dark:bg-[#080808] flex flex-col sm:flex-row gap-3 sm:gap-0 justify-between items-stretch sm:items-center">
        <div className="relative w-full sm:w-1/2">
          <span className="absolute inset-y-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-[#8E92BC]" />
          </span>
          <input
            type="search"
            className="w-full pl-10 dark:text-white pr-4 py-3 sm:py-4 dark:bg-[#3a3a3a] dark:border-[#3a3a3a] border border-gray-200 !rounded-[10px] focus:outline-none"
            placeholder="Search Tasks"
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

      <div className="px-2 sm:px-4 pb-4 pt-4 bg-gray-100 dark:bg-[#080808] min-h-screen overflow-x-hidden w-full max-w-full">
        {taskDetailsModal.show && (
          <ProjectTasksDetails
            task={taskDetailsModal.task}
            onClose={() => setTaskDetailsModal({ show: false, task: null })}
            onEdit={() => handleEditTaskFromDetails(taskDetailsModal.task)}
            onDelete={() =>
              handleDeleteTaskFromDetails(taskDetailsModal.task._id)
            }
          />
        )}

        {showModal && (
          <AddTask
            closeModal={() => {
              setShowModal(false);
              setEditingTask(null);
              setAddTaskStatus(null);
            }}
            onAddTask={handleAddTask}
            editTask={editingTask}
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
}
