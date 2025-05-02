import React, { useMemo, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Ban, Calendar, CircleAlert, MoreHorizontal, Plus, Search, SignalHigh, SignalLow, SignalMedium, SquarePen, Trash2, X } from "lucide-react";
import AddTask from "./AddTask";
import { getAllUserTasks, createTask, deleteTask, updateTask, getTaskById } from "../../../api/user_tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { io } from "socket.io-client";
import { Button } from "@mui/material";

const socket = io("http://localhost:9999");

const statusMap = {
  backlog: "Pending",
  todo: "Todo",
  "in-progress": "In Progress",
  done: "Completed"
}

export default function AllTasks() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getAllUserTasks,
  });

  const [showModal, setShowModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ show: false, taskId: null });
  const [selectedColumn, setSelectedColumn] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [editingTask, setEditingTask] = useState(null); // New state for editing
  const [taskDetailsModal, setTaskDetailsModal] = useState({ show: false, task: null });

  useEffect(() => {

    if (!data) return;

    const handleNewTask = task => {
      queryClient.setQueryData(["tasks"], old => {
        if (!old?.doc) return { doc: [task] }
        const exists = old.doc.some(t => t._id === task._id)
        return exists ? old : { ...old, doc: [...old.doc, task] }
      });
    };

    const handleTaskUpdate = updatedTask => {
      queryClient.setQueryData(["tasks"], old => {
        if (!old?.doc) return old
        return {
          ...old,
          doc: old.doc.map(task => task._id === updatedTask._id ? updatedTask : task)
        }
      });
    };

    const handleTaskDeleted = deletedId => {
      queryClient.setQueryData(["tasks"], old => {
        if (!old?.doc) return old
        return {
          ...old,
          doc: old.doc.filter(task => task._id !== deletedId)
        }
      });
    };

    socket.on("taskCreated", handleNewTask);
    socket.on("taskUpdated", handleTaskUpdate);
    socket.on("taskDeleted", handleTaskDeleted);

    return () => {
      socket.off("taskCreated", handleNewTask);
      socket.off("taskUpdated", handleTaskUpdate);
      socket.off("taskDeleted", handleTaskDeleted);
    };
  }, [data, queryClient]);

  const mutation = useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ["tasks"] });
      const previousTasks = queryClient.getQueryData(["tasks"]);
      const tempId = `temp-${Date.now()}`;

      queryClient.setQueryData(["tasks"], old => {
        if (!old?.doc) return { doc: [{ ...newTask, _id: tempId }] }
        return {
          ...old,
          doc: [
            ...old.doc,
            {
              ...newTask,
              _id: tempId,
              status: newTask.status || "Pending",
              dueDate: newTask.dueDate || new Date().toISOString()
            }
          ]
        }
      });
      return { previousTasks, tempId };
    },
    onSuccess: (data) => {
      toast.success("Task created successfully!");
      socket.emit("taskCreated", data.doc);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err, _, context) => {
      queryClient.setQueryData(["tasks"], context.previousTasks);
      toast.error("Failed to create task!");
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: (_, taskId) => {
      toast.success("Task deleted successfully!");
      socket.emit("taskDeleted", taskId);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: () => toast.error("Failed to delete task!")
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updateTask(id, updates),
    onSuccess: (data) => {
      // toast.success("Task updated successfully!");
      socket.emit("taskUpdated", data.doc);
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (err) => {
      console.error("Error updating task:", err.message);
      toast.error("Failed to update task!");
    }
  });
  const handleTaskClick = (task) => {
    if (task.title && task.description) {
      setTaskDetailsModal({ show: true, task });
    } else {
      fetchTaskDetails.mutate(task._id);
    }
  };
  const fetchTaskDetails = useMutation({
    mutationFn: (id) => getTaskById(id),
    onSuccess: (data) => {
      setTaskDetailsModal({ show: true, task: data.doc });
      console.log("Task retrieved successfully:", data.doc);

    },
    onError: (err) => {
      console.error("Error retrieving task:", err.message);
      toast.error("Failed to retrieve task!");
    }
  });

  const [searchTerm, setSearchTerm] = useState("");
  const board = useMemo(() => {
    const statusColumns = [
      { id: "backlog", title: "BACKLOG", status: statusMap.backlog },
      { id: "todo", title: "TODO", status: statusMap.todo },
      { id: "in-progress", title: "IN PROGRESS", status: statusMap["in-progress"] },
      { id: "done", title: "DONE", status: statusMap.done }
    ];

    if (!data) {
      return {
        columns: statusColumns.map(col => ({ ...col, tasks: [], count: 0 }))
      };
    }
    return {
      columns: statusColumns.map(col => {
        const tasks = data.doc.filter(task =>
          task.status === col.status &&
          task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { ...col, tasks, count: tasks.length };
      })
    };
  }, [data, searchTerm]);

  const [boardState, setBoardState] = useState(board);

  useEffect(() => {
    setBoardState(board);
  }, [board]);

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceCol = boardState.columns.find(col => col.id === source.droppableId);
    const destCol = boardState.columns.find(col => col.id === destination.droppableId);

    if (!sourceCol || !destCol) return;

    const sourceTasks = Array.from(sourceCol.tasks);
    const destTasks = Array.from(destCol.tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceCol.id === destCol.id) {
      // Reordering within same column
      sourceTasks.splice(destination.index, 0, movedTask);

      setBoardState(prev => ({
        ...prev,
        columns: prev.columns.map(col => {
          if (col.id === sourceCol.id) {
            return { ...col, tasks: sourceTasks, count: sourceTasks.length };
          }
          return col;
        })
      }));
    } else {
      // Moving to another column
      movedTask.status = statusMap[destination.droppableId];
      destTasks.splice(destination.index, 0, movedTask);

      const newBoard = {
        ...boardState,
        columns: boardState.columns.map(col => {
          if (col.id === sourceCol.id) {
            return { ...col, tasks: sourceTasks, count: sourceTasks.length };
          }
          if (col.id === destCol.id) {
            return { ...col, tasks: destTasks, count: destTasks.length };
          }
          return col;
        })
      };

      setBoardState(newBoard);

      if (!movedTask._id.startsWith("temp-")) {
        updateMutation.mutate({
          id: movedTask._id,
          updates: { status: statusMap[destination.droppableId] }
        });
      }
    }
  };

  const openAddTaskModal = (columnId) => {
    setSelectedColumn(columnId);
    setEditingTask(null); // Reset editing task when adding new
    setShowModal(true);
  };

  const openEditTaskModal = (task) => {
    setEditingTask(task);
    setSelectedColumn(Object.keys(statusMap).find(key => statusMap[key] === task.status));
    setShowModal(true);
  };

  const handleAddTask = async (taskData) => {
    try {
      if (selectedColumn) {
        taskData.status = statusMap[selectedColumn];
      }

      if (editingTask) {
        // Update existing task
        await updateMutation.mutateAsync({
          id: editingTask._id,
          updates: taskData
        });
      } else {
        // Create new task
        await mutation.mutateAsync(taskData);
      }

      setShowModal(false);
      setEditingTask(null);
    } catch (err) {
      console.error("Failed to process task:", err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div>Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-screen text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return <>
    {/* Nav */}
    <div className=" px-5 pb-5 pt-0 bg-white flex justify-between items-center">
      <div className="relative w-1/2">
        <span className="absolute inset-y-0  flex items-center pl-3">
          <Search className="h-5 w-5 text-[#8E92BC]" />
        </span>
        <input
          type="search"
          className="w-full pl-10 pr-4 py-4 border border-gray-200 !rounded-[10px] focus:outline-none"
          placeholder="Search Project"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <Button
        onClick={() => openAddTaskModal()}
        className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl">
        Add Task
      </Button>
    </div>
    {/* Content */}
    <div className="px-4 pb-4 pt-3 bg-gray-100 min-h-screen ">

      {taskDetailsModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
          <div className="bg-white w-[1000px] rounded-[10px] h-screen shadow-lg p-6 overflow-y-auto">
            <div className="flex justify-end items-center mb-4">
              <button onClick={() => setTaskDetailsModal({ show: false, task: null })}>
                <X size={24} />
              </button>
            </div>

            {taskDetailsModal.task?.image && (
              <div className="mb-4   ">
                <img
                  src="https://i.pinimg.com/736x/17/7c/3a/177c3ae33d13e79d79ac25d66b978a44.jpg"
                  // src={taskDetailsModal.task?.image || "https://i.pinimg.com/736x/17/7c/3a/177c3ae33d13e79d79ac25d66b978a44.jpg"}
                  alt="Task"
                  className="max-w-full h-auto rounded"
                />
              </div>
            )}

            <div className="">
              <div>
                <h2 className="text-xl font-bold mb-4">{taskDetailsModal.task?.title}</h2>

                <div className="mb-4">
                  <h3 className="text-sm font-medium  mb-1">Description :</h3>
                  <p className="text-gray-700 whitespace-pre-line">
                    {taskDetailsModal.task?.description || "No description provided"}
                  </p>
                </div>
                <h6 class="text-sm font-medium">Properties : </h6>
                <div className="mb-4 flex gap-8 mt-3">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Status</h3>
                  <div className="flex items-center">
                    <span className={`px-3 py-1 rounded text-xs font-medium ${taskDetailsModal.task?.status === 'Completed' ? 'bg-green-100 text-green-800' :
                      taskDetailsModal.task?.status === 'In Progress' ? 'bg-yellow-100 text-yellow-800' :
                        taskDetailsModal.task?.status === 'Todo' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                      }`}>
                      {taskDetailsModal.task?.status}
                    </span>
                  </div>
                </div>
                <div className="mb-4 flex gap-8 mt-3">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">priority</h3>
                  <div className="flex items-center">
                    {taskDetailsModal.task?.priority && (
                      <span className={`flex items-center px-3 py-1 rounded text-xs font-medium
                        ${taskDetailsModal.task.priority === 'Urgent' ? 'bg-red-600/20 text-red-500 border-red-600' :
                          taskDetailsModal.task.priority === 'High' ? 'bg-orange-500/20 text-orange-500 border-orange-500' :
                            taskDetailsModal.task.priority === 'Medium' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500' :
                              taskDetailsModal.task.priority === 'Low' ? 'bg-blue-500 text-blue-300 border-blue-300' :
                                taskDetailsModal.task.priority === 'Normal' ? 'bg-gray-500 text-gray-200 border-gray-300' :
                                  'bg-gray-100 text-gray-800'}`}>
                        {
                          {
                            'Urgent': <CircleAlert size={18} className="mr-1 border rounded p-0.5 bg-red-600/20 text-red-500 border-red-600" />,
                            'High': <SignalHigh size={18} className="mr-1 border rounded p-0.5 bg-orange-500/20 text-orange-500 border-orange-500" />,
                            'Medium': <SignalMedium size={18} className="mr-1 border rounded p-0.5 bg-yellow-500/20 text-yellow-500 border-yellow-500" />,
                            'Low': <SignalLow size={18} className="mr-1 border rounded p-0.5 bg-blue-500 text-blue-300 border-blue-300" />,
                            'Normal': <Ban size={18} className="mr-1  border rounded p-0.5 bg-gray-500 text-gray-200 border-gray-300" />
                          }[taskDetailsModal.task.priority]
                        }
                        {taskDetailsModal.task.priority}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <div className="mb-4 flex gap-6">
                  <h3 className="text-sm font-medium text-gray-500 mb-1">Due Date</h3>
                  <div className="flex items-center text-gray-700">
                    <Calendar className="mr-2" size={16} />
                    {taskDetailsModal.task?.dueDate ? (
                      new Date(taskDetailsModal.task.dueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })
                    ) : "No due date"}
                  </div>
                </div>

                {taskDetailsModal.task?.completedAt && (
                  <div className="mb-4 ">
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Completed At</h3>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="mr-2" size={16} />
                      {new Date(taskDetailsModal.task.completedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                )}

              </div>
            </div>

            <div className="flex justify-end gap-2 mt-6">
              <Button
                onClick={() => {
                  setTaskDetailsModal({ show: false, task: null });
                  openEditTaskModal(taskDetailsModal.task);
                }}
                className="!flex items-center justify-center gap-2 !text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"

              >
                Edit
              </Button>
              <Button
                onClick={() => {
                  setTaskDetailsModal({ show: false, task: null });
                  setDeleteModal({ show: true, taskId: taskDetailsModal.task._id });
                }}
                className="!text-base !capitalize !bg-red-500 hover:shadow-lg hover:shadow-red-500 !font-bold !text-white !py-3 !px-7 !rounded-xl"

              // className="!text-base !capitalize !bg-red-500 !font-bold !text-white !py-2 !px-4 !rounded-lg"
              >
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}
      {showModal && (
        <AddTask
          closeModal={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onAddTask={handleAddTask}
          initialStatus={selectedColumn ? statusMap[selectedColumn] : "Pending"}
          initialData={editingTask}
          isEditing={!!editingTask}
          disableStatus={!!selectedColumn && !editingTask}
        />
      )}

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-8 overflow-x-auto pb-4 px-4">
          {boardState.columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-[23%]">
              <div className="rounded-[15px] bg-white shadow-sm">
                <div className="p-3 flex justify-between items-center border-b">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm cursor-pointer">{column.title}</span>
                    <span className={`text-white rounded-full w-6 h-6 flex items-center justify-center text-xs ${column.id === "todo" ? "bg-[#65aaee]" :
                      column.id === "in-progress" ? "bg-[#e5e747]" :
                        column.id === "done" ? "bg-red-500" : "bg-[#66d475]"}`}>
                      {column.count}
                    </span>
                  </div>
                  <button
                    onClick={() => openAddTaskModal(column.id)}
                    className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100 border"
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
                          <Draggable key={task._id} draggableId={task._id.toString()} index={index}>
                            {(provided) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className="bg-white border border-gray-200 rounded-[12px] p-3 shadow-sm"
                              >
                                <div className="flex justify-between items-start mb-3 border-b border-gray-200 pb-2">
                                  <h3 onClick={() => handleTaskClick(task)} className="text-sm font-medium">
                                    {task.title.split(" ").length > 5
                                      ? task.title.split(" ").slice(0, 5).join(" ") + "..."
                                      : task.title}
                                  </h3>
                                  <div className="flex">
                                    <button
                                      onClick={() => setDeleteModal({ show: true, taskId: task._id })}
                                      className="text-red-400 hover:text-red-600"
                                    >
                                      <Trash2 width={19} height={24} />
                                    </button>
                                    <button
                                      onClick={() => openEditTaskModal(task)}
                                      className="text-gray-400 hover:text-gray-600 ml-2"
                                    >
                                      <SquarePen width={19} height={24} />
                                    </button>
                                  </div>
                                </div>
                                <p className="text-xs text-gray-500 mb-2">
                                  {task.description.split(" ").length > 5
                                    ? task.description.split(" ").slice(0, 5).join(" ") + "..."
                                    : task.description}
                                </p>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1 text-xs text-gray-500">
                                    <Calendar size={14} />
                                    <span>
                                      {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                                    </span>
                                  </div>
                                  <div className="w-6 h-6 rounded-full overflow-hidden">
                                    {/* User avatar if available */}
                                  </div>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      ) : (
                        <div className="text-center text-gray-400 py-4 text-sm">No tasks available</div>
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
          <div className="bg-white w-[426px] rounded-[10px] shadow-lg p-6  flex flex-col justify-center items-center">
            <CircleAlert size={40} color="#f8bb86" />
            <h2 className="text-gray-500 text-4xl font-medium mt-4 mb-4" >Delete Task</h2>
            <div className=" mb-[24px]">Are you sure you want to delete this task?</div>
            <div className="flex justify-end gap-4">
              <Button
                onClick={() => setDeleteModal({ show: false, taskId: null })}
                className="!text-base !capitalize !bg-[#7787e2] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl">
                Cancel
              </Button>
              <Button
                onClick={() => {
                  setIsDeleting(true);
                  deleteMutation.mutate(deleteModal.taskId, {
                    onSettled: () => {
                      setIsDeleting(false);
                      setDeleteModal({ show: false, taskId: null });
                    }
                  });
                }}
                className="!text-base !capitalize !bg-red-500 hover:shadow-lg hover:shadow-red-500 !font-bold !text-white !py-3 !px-7 !rounded-xl"
              >
                {isDeleting ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin mr-2"></div> Deleting
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
}