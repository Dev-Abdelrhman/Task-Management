import React, { useMemo, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Ban,
  Calendar,
  CircleAlert,
  MoreHorizontal,
  Plus,
  Search,
  SignalHigh,
  SignalLow,
  SignalMedium,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import AddTask from "./AddTask";
import {
  getAllUserTasks,
  createTask,
  deleteTask,
  updateTask,
  getTaskById,
} from "../../../api/user_tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import TaskColumn from "../Projects/TaskColumn";
import DeleteTaskModal from "../Projects/ProjectModals/DeleteTaskModal";
import { useUserTaskManagement } from "../../../hooks/useUserTaskManagement";
import { useUserBoardManagement } from "../../../hooks/useUserBoardManagement";

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
    selectedColumn,
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
    }
  );

  const openAddTaskModal = (columnId) => {
    setSelectedColumn(columnId);
    setEditingTask(null);
    setShowModal(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setSelectedColumn(
      Object.keys(statusMap).find((key) => statusMap[key] === task.status)
    );
    setShowModal(true);
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
      <div className="px-5 pb-5 pt-0 bg-white dark:bg-[#080808] flex justify-between items-center">
        <div className="relative w-1/2">
          <span className="absolute inset-y-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-[#8E92BC]" />
          </span>
          <input
            type="search"
            className="w-full pl-10 dark:text-white pr-4 py-4 dark:bg-[#3a3a3a] dark:border-[#3a3a3a] border border-gray-200 !rounded-[10px] focus:outline-none"
            placeholder="Search Tasks"
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
        {showModal && (
          <AddTask
            closeModal={() => {
              setShowModal(false);
              setEditingTask(null);
            }}
            onAddTask={handleAddTask}
            editTask={editingTask}
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
}
