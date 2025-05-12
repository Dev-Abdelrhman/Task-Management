import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Calendar,
  CircleAlert,
  Plus,
  Search,
  SquarePen,
  Trash2,
  X,
} from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getAllProjectTasks,
  getOneTask,
  createProjectTask,
  updateTaskStatus,
  deleteTaskStatus,
} from "../../../api/projectTasks";
import AddProjectTask from "./AddProjectTask";
import ProjectTasksDetails from "./ProjectTasksDetails";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { Button } from "@mui/material";

const socket = io("http://localhost:9999");

const statusMap = {
  backlog: "Pending",
  todo: "Todo",
  "in-progress": "In Progress",
  done: "Completed",
};

const statusColumns = [
  { id: "backlog", title: "BACKLOG", status: statusMap.backlog },
  { id: "todo", title: "TODO", status: statusMap.todo },
  { id: "in-progress", title: "IN PROGRESS", status: statusMap["in-progress"] },
  { id: "done", title: "DONE", status: statusMap.done },
];

const ProjectTasks = () => {
  const { projectId } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [showModal, setShowModal] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, taskId: null });
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [editTask, setEditTask] = useState(null);
  const [DetailsModal, setDetailsModal] = useState({ show: false, task: null });
  const [board, setBoard] = useState({
    columns: statusColumns.map((col) => ({ ...col, tasks: [], count: 0 })),
  });

  const { data, isError, error } = useQuery({
    queryKey: ["projectTasks", user?._id, projectId],
    queryFn: () => getAllProjectTasks(user._id, projectId),
    enabled: !!user?._id && !!projectId,
  });

  const filterTasksBySearchTerm = (tasks) => {
    if (!searchTerm.trim()) return tasks;
    return tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  useEffect(() => {
    if (data?.doc) {
      const newColumns = statusColumns.map((col) => {
        const tasks = data.doc.filter((task) => {
          const taskStatus = task.status;
          const statusMatch =
            taskStatus === col.status ||
            taskStatus.toLowerCase().replace(/\s/g, "-") === col.id;
          return statusMatch;
        });

        // Apply search filter to the tasks
        const filteredTasks = filterTasksBySearchTerm(tasks);

        return { ...col, tasks: filteredTasks, count: filteredTasks.length };
      });
      setBoard({ columns: newColumns });
    }
  }, [data, searchTerm]); // Add searchTerm to dependencies

  useEffect(() => {
    if (!user || !projectId) return;
    console.log("Socket connecting");

    const handleNewTask = (task) => {
      console.log("tas-created:", task);
      queryClient.setQueryData(["projectTasks", user._id, projectId], (old) => {
        console.log("tasksNow", old?.doc);
        if (!old?.doc) return { doc: [task] };
        const tempTask = old.doc.find(
          (t) => t._id.startsWith("temp-") && t.title === task.title
        );
        if (tempTask) {
          return {
            ...old,
            doc: old.doc.map((t) => (t._id === tempTask._id ? task : t)),
          };
        }
        const exists = old.doc.some((t) => t._id === task._id);
        return exists ? old : { ...old, doc: [...old.doc, task] };
      });
    };

    const handleTaskUpdate = (updatedTask) => {
      queryClient.setQueryData(["projectTasks", user._id, projectId], (old) => {
        if (!old?.doc) return old;
        return {
          ...old,
          doc: old.doc.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          ),
        };
      });
    };

    const handleTaskDeleted = (deletedId) => {
      queryClient.setQueryData(["projectTasks", user._id, projectId], (old) => {
        if (!old?.doc) return old;
        return {
          ...old,
          doc: old.doc.filter((task) => task._id !== deletedId),
        };
      });
    };
    socket.on("connect", () => console.log("socket connected"));
    socket.on("task-created", handleNewTask);
    socket.on("task-updated", handleTaskUpdate);
    socket.on("task-deleted", handleTaskDeleted);

    return () => {
      socket.off("task-created", handleNewTask);
      socket.off("task-updated", handleTaskUpdate);
      socket.off("task-deleted", handleTaskDeleted);
    };
  }, [user, projectId, queryClient]);

  const mutation = useMutation({
    mutationFn: (newTask) => createProjectTask(user._id, projectId, newTask),
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({
        queryKey: ["projectTasks", user._id, projectId],
      });
      const previousTasks = queryClient.getQueryData([
        "projectTasks",
        user._id,
        projectId,
      ]);
      const tempId = `temp-${Date.now()}`;

      queryClient.setQueryData(["projectTasks", user._id, projectId], (old) => {
        if (!old || !old.doc) {
          return { doc: [{ ...newTask, _id: tempId }] };
        }
        return {
          ...old,
          doc: [
            ...old.doc,
            {
              ...newTask,
              _id: tempId,
              status: newTask.status || "Pending",
              dueDate:
                newTask.dueDate || new Date().toISOString().split("T")[0],
            },
          ],
        };
      });
      return { previousTasks, tempId };
    },
    onSuccess: (data) => {
      toast.success("Task created successfully!");
      queryClient.setQueriesData({
        queryKey: ["projectTasks", user._id, projectId],
      });
    },
    onError: (_, __, context) => {
      queryClient.setQueryData(
        ["projectTasks", user._id, projectId],
        context.previousTasks
      );
      toast.error("Failed to create task!");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (taskId) => deleteTaskStatus(user._id, projectId, taskId),
    onSuccess: (_, taskId) => {
      toast.success("Deleted successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", user._id, projectId],
      });
    },
    onError: () => toast.error("Failed to delete task!"),
  });

  const updateMutation = useMutation({
    mutationFn: ({ taskId, taskData }) =>
      updateTaskStatus(user._id, projectId, taskId, taskData),
    onSuccess: (data, { taskId }) => {
      queryClient.invalidateQueries({
        queryKey: ["projectTasks", user._id, projectId],
      });
    },
    onError: () => toast.error("Failed to update task!"),
  });

  const handleclickTask = (task) => {
    console.log("Task clicked:", task);
    fetchtaskDetails.mutate({ taskId: task._id, userId: user._id, projectId });
  };
  const fetchtaskDetails = useMutation({
    mutationFn: ({ taskId, userId, projectId }) =>
      getOneTask(userId, projectId, taskId),
    onSuccess: (data) => {
      console.log("Raw AOI response:", data);
      const task = data.doc || data;
      if (!task) {
        throw new Error("No task data returned from API");
      }
      setDetailsModal({ show: true, task });
      console.log("Task retrieved successfully:", task);
    },
    onError: (err) => {
      console.error("Error retrieving task:", err.message);
      toast.error("Failed to retrieve task!");
    },
  });

  const handleDragEnd = (result) => {
    const { source, destination } = result;

    if (!destination) return;

    const sourceCol = board.columns.find(
      (col) => col.id === source.droppableId
    );
    const destCol = board.columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceCol || !destCol) return;

    const sourceTasks = Array.from(sourceCol.tasks);
    const destTasks = Array.from(destCol.tasks);

    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceCol.id === destCol.id) {
      // Moving inside the same column
      sourceTasks.splice(destination.index, 0, movedTask);

      const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === sourceCol.id) {
            return { ...col, tasks: sourceTasks, count: sourceTasks.length };
          }
          return col;
        }),
      };

      setBoard(newBoard);
    } else {
      // Moving to another column
      movedTask.status = destCol.status;
      destTasks.splice(destination.index, 0, movedTask);

      const newBoard = {
        ...board,
        columns: board.columns.map((col) => {
          if (col.id === sourceCol.id) {
            return { ...col, tasks: sourceTasks, count: sourceTasks.length };
          }
          if (col.id === destCol.id) {
            return { ...col, tasks: destTasks, count: destTasks.length };
          }
          return col;
        }),
      };

      setBoard(newBoard);

      if (user._id && movedTask._id && !movedTask._id.startsWith("temp-")) {
        updateMutation.mutate({
          taskId: movedTask._id,
          taskData: { status: destCol.status },
        });
      }
    }
  };
  const openAddTaskModal = (columnId) => {
    setSelectedColumn(columnId);
    setEditTask(null);
    setShowModal(true);
  };
  const openModal = (task) => {
    setEditTask(task);
    setSelectedColumn(null);
    setShowModal(true);
  };

  const handleAddTask = async (taskData) => {
    console.log("Edit Mode:", editTask);
    console.log("Data to submit:", taskData);
    try {
      if (!editTask && selectedColumn) {
        const column = board.columns.find((col) => col.id === selectedColumn);
        if (column) taskData.status = column.status;
      }
      if (editTask) {
        await updateMutation.mutateAsync({ taskId: editTask._id, taskData });
        setEditTask(null);
      } else {
        await mutation.mutateAsync(taskData);
      }
      setShowModal(false);
    } catch (err) {
      console.error("Failed to save task:", err);
      toast.error("Failed to save task!");
    }
  };

  const handleEditTask = (task) => {
    setDetailsModal({ show: false, task: null });
    setEditTask(task);
    setShowModal(true);
  };

  const handleDeleteTask = (task) => {
    setDetailsModal({ show: false, task: null });
    setDeleteModal({ show: true, taskId: task._id });
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
      <div className=" px-5 pb-5 pt-0 bg-white dark:bg-[#080808] flex justify-between items-center ">
        <div className="relative w-1/2">
          <span className="absolute inset-y-0  flex items-center pl-3">
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
        {DetailsModal.show && (
          <ProjectTasksDetails
            task={DetailsModal.task}
            onClose={() => setDetailsModal({ show: false, task: null })}
            onEdit={() => handleEditTask(DetailsModal.task)}
            onDelete={() => handleDeleteTask(DetailsModal.task)}
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
              <div key={column.id} className="flex-shrink-0 w-[23%]">
                <div className="rounded-[15px] dark:bg-[#1a1a1a] bg-white shadow-sm">
                  <div className="p-3 flex justify-between items-center border-b dark:border-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium dark:text-white text-sm">
                        {column.title}
                      </span>
                      <span
                        className={`text-white rounded-full w-6 h-6 flex items-center justify-center text-xs ${
                          column.id === "todo"
                            ? "bg-[#65aaee]"
                            : column.id === "in-progress"
                            ? "bg-[#e5e747]"
                            : column.id === "done"
                            ? "bg-[#66d475]"
                            : "bg-red-500"
                        }`}
                      >
                        {column.count}
                      </span>
                    </div>
                    <button
                      onClick={() => openAddTaskModal(column.id)}
                      className="w-6 h-6 dark:text-white dark:border-0 dark:hover:bg-[#1a1a1a] flex items-center justify-center rounded-full hover:bg-gray-100 border"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <Droppable droppableId={column.id} direction="vertical">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex flex-col p-2 min-h-[200px] space-y-2"
                      >
                        {column.tasks.length > 0 ? (
                          column.tasks.map((task, index) => (
                            <Draggable
                              key={task._id}
                              draggableId={task._id.toString()}
                              index={index}
                            >
                              {(provided) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  className="bg-white border dark:bg-[#2D2D2D] dark:border-0 border-gray-200 rounded-[12px] p-3 shadow-sm max-w-[350px]"
                                >
                                  <div className="flex justify-between items-start mb-3 border-b border-gray-200 pb-2">
                                    <h3
                                      className="text-sm dark:text-gray-200 font-medium truncate"
                                      onClick={() => handleclickTask(task)}
                                    >
                                      {task.title?.split(" ").length > 5
                                        ? task.title
                                            .split(" ")
                                            .slice(0, 5)
                                            .join(" ") + "..."
                                        : task.title}
                                    </h3>
                                    <div className="flex">
                                      <button
                                        onClick={() =>
                                          setDeleteModal({
                                            show: true,
                                            taskId: task._id,
                                          })
                                        }
                                        className="text-red-400 hover:text-red-600"
                                      >
                                        <Trash2 width={19} height={24} />
                                      </button>
                                      <button
                                        onClick={() => openModal(task)}
                                        className="text-gray-400 hover:text-gray-600 ml-2"
                                      >
                                        <SquarePen width={19} height={24} />
                                      </button>
                                    </div>
                                  </div>
                                  <p className="text-xs text-gray-500 dark:!text-gray-400 mb-2 truncate">
                                    {" "}
                                    {task.description?.split(" ").length > 5
                                      ? task.description
                                          .split(" ")
                                          .slice(0, 5)
                                          .join(" ") + "..."
                                      : task.description}
                                  </p>
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar size={14} />
                                    <span>
                                      {task.dueDate
                                        ? new Date(
                                            task.dueDate
                                          ).toLocaleDateString()
                                        : "No date"}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          ))
                        ) : (
                          <div className="text-center text-gray-400 py-4 text-sm">
                            No tasks available
                          </div>
                        )}
                        {provided.placeholder}
                      </div>
                    )}
                  </Droppable>
                </div>
              </div>
            ))}
          </div>
        </DragDropContext>

        {deleteModal.show && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white w-[426px] rounded-[10px] shadow-lg p-6 dark:bg-[#080808]">
              <CircleAlert size={40} color="#f8bb86" />
              <h2 className="text-gray-500 text-4xl dark:text-gray-300 font-medium mt-4 mb-4">
                Delete Task
              </h2>
              <div className=" text-gray-600 dark:text-gray-400 mb-[24px]">
                Are you sure you want to delete this task?
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => setDeleteModal({ show: false, taskId: null })}
                  className="!text-base !capitalize !bg-[#7787e2] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
                >
                  Cancel
                </Button>
                <Button
                  onClick={() => {
                    setIsDeleting(true);
                    deleteMutation.mutate(deleteModal.taskId, {
                      onSettled: () => {
                        setIsDeleting(false);
                        setDeleteModal({ show: false, taskId: null });
                      },
                    });
                  }}
                  className="!text-base !capitalize !bg-red-500 hover:shadow-lg hover:shadow-red-500 !font-bold !text-white !py-3 !px-7 !rounded-xl"
                >
                  {isDeleting ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin mr-2"></div>{" "}
                      Deleting
                    </div>
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProjectTasks;
