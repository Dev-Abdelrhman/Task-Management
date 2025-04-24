import React, { useMemo, useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { Calendar, MoreHorizontal, Plus, SquarePen, Trash2 } from "lucide-react";
import { Button } from "@mui/material";
import AddTask from "./AddTask";
import { getAllUserTasks, createTask, deleteTask, updateTask } from "../../../api/user_tasks";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

export default function AllTasks() {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["tasks"],
    queryFn: getAllUserTasks,
  });

  const [showModal, setShowModal] = useState(false);

  const mutation = useMutation({
    mutationFn: createTask,
    onMutate: async (newTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData(['tasks']);
      queryClient.setQueryData(['tasks'], (old) => {
        const newTaskWithId = {
          ...newTask,
          _id: Date.now().toString(),
          // status: "Pending",
          status: newTask.status || "Pending",
          dueDate: newTask.dueDate || new Date().toISOString()
        };
        return {
          ...old,
          doc: [...old.doc, newTaskWithId]
        };
      });
      return { previousTasks };
    },
    onError: (err, newTask, context) => {
      queryClient.setQueryData(['tasks'], context.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
    onError: (error) => {
      console.error("Error deleting task:", error.message);
    }
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }) => updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("Task is updated 🛠️");
    },
    onError: (err) => {
      console.error("Error updating task:", err.message);
      toast.error("Failed to update task 🚨");
    }
  });

  const board = useMemo(() => {
    if (!data) {
      return {
        columns: [
          { id: "backlog", title: "Backlog", count: 0, tasks: [] },
          { id: "todo", title: "TODO", count: 0, tasks: [] },
          { id: "in-progress", title: "IN PROGRESS", count: 0, tasks: [] },
          { id: "done", title: "DONE", count: 0, tasks: [] }
        ]
      };
    }

    const pendingTasks = data.doc.filter(task => task.status === "Pending");
    const todoTasks = data.doc.filter(task => task.status === "Todo");
    const inProgressTasks = data.doc.filter(task => task.status === "In Progress");
    const doneTasks = data.doc.filter(task => task.status === "Completed");

    return {
      columns: [
        { id: "backlog", title: "Backlog", tasks: pendingTasks, count: pendingTasks.length },
        { id: "todo", title: "TODO", tasks: todoTasks, count: todoTasks.length },
        { id: "in-progress", title: "IN PROGRESS", tasks: inProgressTasks, count: inProgressTasks.length },
        { id: "done", title: "DONE", tasks: doneTasks, count: doneTasks.length }
      ]
    };
  }, [data]);

  const [boardState, setBoardState] = useState(board);

  useEffect(() => {
    setBoardState(board);
  }, [board]);

  const parseDueDate = (dueDate) => {
    if (!dueDate) return new Date();
    return new Date(dueDate);
  };

  const handleDragEnd = (result) => {
    const { destination, source } = result;
    if (!destination || (destination.droppableId === source.droppableId && destination.index === source.index)) {
      return;
    }

    const sourceColumn = boardState.columns.find(col => col.id === source.droppableId);
    const destColumn = boardState.columns.find(col => col.id === destination.droppableId);
    if (!sourceColumn || !destColumn) return;

    const task = sourceColumn.tasks[source.index];
    const statusMap = {
      "backlog": "Pending",
      "todo": "Todo",
      "in-progress": "In Progress",
      "done": "Completed"
    };
    const newStatus = statusMap[destination.droppableId];

    if (task.status !== newStatus) {
      updateMutation.mutate({ id: task._id, updates: { status: newStatus } });
    }

    const newBoard = { ...boardState };
    sourceColumn.tasks.splice(source.index, 1);
    task.status = newStatus;
    destColumn.tasks.splice(destination.index, 0, task);
    sourceColumn.count = sourceColumn.tasks.length;
    destColumn.count = destColumn.tasks.length;

    setBoardState(newBoard);
  };

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);
  const handleAddTask = (taskData) => {
    mutation.mutate(taskData);
    closeModal();
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen"><div>Loading...</div></div>;
  }

  if (isError) {
    return <div className="flex justify-center items-center h-screen text-red-500">Error: {error.message}</div>;
  }

  return (
    <div className="p-4 bg-gray-100 min-h-screen rounded-[30px]">
      <div className="p-4 flex justify-end">
        <button onClick={openModal} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Task</button>
        {showModal && <AddTask closeModal={closeModal} onAddTask={handleAddTask} />}
      </div>
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-4">
          {boardState.columns.map((column) => (
            <div key={column.id} className="flex-shrink-0 w-72">
              <div className="rounded-[30px]">
                <div className="p-3 flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-sm">{column.title}</span>
                    <span className={`text-white rounded-full w-6 h-6 flex items-center justify-center text-xs
                      ${column.id === "todo" ? "bg-[#65aaee]" : column.id === "in-progress" ? "bg-[#e5e747]" : column.id === "done" ? "bg-red-500" : "bg-[#66d475]"}`}>{column.count}</span>
                  </div>
                  {column.id === "backlog" && (
                    <div className="btn-container bg-white rounded-[50%] border border-[#808080]">
                      <button onClick={openModal} className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-gray-100">
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>
                <Droppable droppableId={column.id}>
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.droppableProps} className="p-2 min-h-[200px]">
                      {column.tasks.map((task, index) => (
                        <Draggable key={task._id} draggableId={task._id} index={index}>
                          {(provided) => (
                            <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="bg-white border border-gray-200 rounded-[12px] p-3 mb-2 shadow-sm">
                              <div className="flex justify-between items-start mb-3 border-b border-gray-200 pb-2">
                                <h3 className="text-sm font-medium">{task.title}</h3>
                                <button className=" flex">
                                  <button onClick={() => deleteMutation.mutate(task._id)} className="text-red-400 hover:text-red-600">
                                    <Trash2 width={19} height={24} />
                                  </button>
                                  <div className="text-gray-400 hover:text-gray-600 ml-2">
                                    <SquarePen width={19} height={24} />
                                  </div>
                                </button>
                              </div>
                              <p className="text-xs text-gray-500 mb-2">{task.description}</p>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-1 text-xs text-gray-500">
                                  <Calendar size={14} />
                                  <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No date'}</span>
                                </div>
                                <div className="w-6 h-6 rounded-full overflow-hidden">
                                  {/* User avatar if available */}
                                </div>
                              </div>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
