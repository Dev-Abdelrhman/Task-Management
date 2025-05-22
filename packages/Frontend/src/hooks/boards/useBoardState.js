import { useState, useEffect } from "react";

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

export const useBoardState = (data, searchTerm) => {
  const [board, setBoard] = useState({
    columns: statusColumns.map((col) => ({ ...col, tasks: [], count: 0 })),
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

        const filteredTasks = filterTasksBySearchTerm(tasks);

        return { ...col, tasks: filteredTasks, count: filteredTasks.length };
      });
      setBoard({ columns: newColumns });
    }
  }, [data, searchTerm]);

  return {
    board,
    setBoard,
    statusColumns,
  };
}; 