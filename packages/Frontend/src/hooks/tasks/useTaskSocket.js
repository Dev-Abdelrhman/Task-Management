import { useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:9999");

export const useTaskSocket = (userId, projectId, queryClient) => {
  useEffect(() => {
    if (!userId || !projectId) return;

    const handleNewTask = (task) => {
      queryClient.setQueryData(["projectTasks", userId, projectId], (old) => {
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
      queryClient.setQueryData(["projectTasks", userId, projectId], (old) => {
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
      queryClient.setQueryData(["projectTasks", userId, projectId], (old) => {
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
  }, [userId, projectId, queryClient]);
}; 