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
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { Button } from "@mui/material";

const socket = io("http://localhost:9999");

const statusMap = {
  pending: "Pending",
  todo: "Todo",
  inprogress: "In Progress",
  done: "Completed",
};

const statusColumns = [
  { id: "pending", title: "PENDING", status: statusMap.pending },
  { id: "todo", title: "TODO", status: statusMap.todo },
  { id: "in-progress", title: "IN PROGRESS", status: statusMap.inprogress },
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
      queryClient.setQueryData(["projectTasks", user._id, projectId], (old) => {
        if (!old?.doc) return { doc: [task] };
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
      <div className=" px-5 pb-5 pt-0 bg-white dark:bg-[#121212] flex justify-between items-center ">
        <div className="relative w-1/2">
          <span className="absolute inset-y-0  flex items-center pl-3">
            <Search className="h-5 w-5 text-[#8E92BC]" />
          </span>
          <input
            type="search"
            className="w-full pl-10 pr-4 py-4 border border-gray-200 !rounded-[10px] focus:outline-none"
            placeholder="Search tasks by title"
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
      <div className="px-4 pb-4 pt-4 bg-gray-100 dark:bg-[#121212] min-h-screen ">
        {showModal && (
          <AddProjectTask
            closeModal={() => setShowModal(false)}
            onAddTask={handleAddTask}
            editTask={editTask}
            initialStatus={
              selectedColumn
                ? board.columns.find((col) => col.id === selectedColumn)?.status
                : "Pending"
            }
          />
        )}

        {DetailsModal.show && DetailsModal.task && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
            <div className="bg-white dark:bg-[#1E1E1E] w-[1000px] rounded-[10px] h-screen shadow-lg p-6 overflow-y-auto">
              <div className="flex justify-end items-center mb-4">
                <button
                  onClick={() => setDetailsModal({ show: false, task: null })}
                >
                  <X size={24} />
                </button>
              </div>

              {DetailsModal.task.image && (
                <div className="mb-4   ">
                  <img
                    src={
                      DetailsModal.task.image ||
                      "https://fakeimg.pl/1280x720?text=No+Image"
                    }
                    alt="Task"
                    className="max-w-full h-auto rounded"
                  />
                </div>
              )}

              <div className="">
                <div>
                  <h2 className="text-xl dark:text-white font-bold mb-4">
                    {DetailsModal.task.title}
                  </h2>

                  <div className="mb-4">
                    <h3 className="text-sm font-medium dark:text-gray-200  mb-1">Description :</h3>
                    <p className="text-gray-700 dark:text-[#a0a0a0] whitespace-pre-line">
                      {DetailsModal.task.description ||
                        "No description provided"}
                    </p>
                  </div>
                  <h6 class="text-sm font-medium dark:text-gray-200">Properties : </h6>
                  <div className="mb-4 flex gap-8 mt-3">
                    <h3 className="text-sm font-medium dark:text-gray-200 text-gray-500 mb-1">
                      Status
                    </h3>
                    <div className="flex items-center">
                      <span
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          DetailsModal.task?.status === "Completed"
                            ? "bg-green-100 text-green-800"
                            : DetailsModal.task?.status === "In Progress"
                            ? "bg-yellow-100 text-yellow-800"
                            : DetailsModal.task?.status === "Todo"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {DetailsModal.task.status}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4 flex gap-8 mt-3">
                    <h3 className="text-sm font-medium dark:text-gray-200 text-gray-500 mb-1">
                      priority
                    </h3>
                    <div className="flex items-center"></div>
                  </div>
                </div>

                <div>
                  <div className="mb-4 flex gap-6">
                    <h3 className="text-sm font-medium dark:text-gray-200 text-gray-500 mb-1">
                      Due Date
                    </h3>
                    <div className="flex items-center text-gray-700 dark:text-[#a0a0a0]">
                      <Calendar className="mr-2" size={16} />
                      {DetailsModal.task.dueDate
                        ? new Date(
                            DetailsModal.task.dueDate
                          ).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "No due date"}
                    </div>
                  </div>

                  {DetailsModal.task.completedAt && (
                    <div className="mb-4 ">
                      <h3 className="text-sm font-medium dark:text-gray-200 text-gray-500 mb-1">
                        Completed At
                      </h3>
                      <div className="flex items-center text-gray-700">
                        <Calendar className="mr-2" size={16} />
                        {new Date(
                          DetailsModal.task.completedAt
                        ).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-end gap-2 mt-6">
                <Button
                  onClick={() => {
                    setDetailsModal({ show: false, task: null });
                    openModal(DetailsModal.task);
                  }}
                  className="!flex items-center justify-center gap-2 !text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => {
                    setDetailsModal({ show: false, task: null });
                    setDeleteModal({
                      show: true,
                      taskId: DetailsModal.task._id,
                    });
                  }}
                  className="!text-base !capitalize !bg-red-500 hover:shadow-lg hover:shadow-red-500 !font-bold !text-white !py-3 !px-7 !rounded-xl"
                >
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex gap-8 overflow-x-auto pb-4 px-4">
            {board.columns.map((column) => (
              <div key={column.id} className="flex-shrink-0 w-[23%]">
                <div className="rounded-[15px] bg-white dark:bg-[#1E1E1E] shadow-sm">
                  <div className="p-3 flex justify-between items-center border-b">
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
                            ? "bg-red-500"
                            : "bg-[#66d475]"
                        }`}
                      >
                        {column.count}
                      </span>
                    </div>
                    <button
                      onClick={() => openAddTaskModal(column.id)}
                      className="w-6 dark:text-white h-6 flex items-center justify-center rounded-full hover:bg-gray-100 border"
                    >
                      <Plus size={16} />
                    </button>
                  </div>

                  <Droppable droppableId={column.id} direction="vertical">
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className="flex  flex-col p-2 min-h-[200px] space-y-2"
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
                                  className="bg-white border dark:bg-[#2D2D2D] dark:border-gray-700 border-gray-200 rounded-[12px] p-3 shadow-sm max-w-[350px]"
                                >
                                  <div className="flex justify-between items-start mb-3 border-b border-gray-200 pb-2">
                                    <h3
                                      className="text-sm dark:text-gray-200 font-medium truncate"
                                      onClick={() => handleclickTask(task)}
                                    >
                                      {task.title.split(" ").length > 5
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
                                  <p className="text-xs text-gray-500 mb-2 truncate">
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
          <div className="fixed inset-0 bg-black  bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white w-[426px] dark:bg-[#1E1E1E] rounded-[10px] shadow-lg p-6  flex flex-col justify-center items-center">
              <CircleAlert size={40} color="#f8bb86" />
              <h2 className="text-gray-500 dark:text-gray-300 text-4xl font-medium mt-4 mb-4">
                Delete Task
              </h2>
              <div className="text-gray-600 dark:text-gray-400 mb-[24px]">
                Are you sure you want to delete this task?
              </div>
              <div className="flex justify-end gap-4">
                <Button
                  onClick={() => setDeleteModal({ show: false, taskId: null })}
                  className="!text-base !capitalize !bg-[#7787e2] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
                >
                  Cancel
                </Button>
                {/* <Button
                onClick={() => {
                  deleteMutation.mutate(deleteModal.taskId);
                  setDeleteModal({ show: false, taskId: null });
                }}
                className="!text-base !capitalize !bg-red-500 hover:shadow-lg hover:shadow-red-500 !font-bold !text-white !py-3 !px-7 !rounded-xl">
                Delete
              </Button> */}
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
