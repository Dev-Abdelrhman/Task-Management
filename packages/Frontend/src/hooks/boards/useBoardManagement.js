import { useState, useEffect, useMemo } from "react";

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

export const useBoardManagement = (data, searchTerm, onStatusUpdate) => {
  const [boardState, setBoardState] = useState({
    columns: statusColumns.map((col) => ({ ...col, tasks: [], count: 0 })),
  });

  const board = useMemo(() => {
    if (!data) {
      return {
        columns: statusColumns.map((col) => ({ ...col, tasks: [], count: 0 })),
      };
    }
    return {
      columns: statusColumns.map((col) => {
        const tasks = data.doc.filter(
          (task) =>
            task.status === col.status &&
            task.title &&
            task.title.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return { ...col, tasks, count: tasks.length };
      }),
    };
  }, [data, searchTerm]);

  useEffect(() => {
    setBoardState(board);
  }, [board]);

  const handleDragEnd = (result) => {
    const { destination, source } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    )
      return;

    const sourceCol = boardState.columns.find(
      (col) => col.id === source.droppableId
    );
    const destCol = boardState.columns.find(
      (col) => col.id === destination.droppableId
    );

    if (!sourceCol || !destCol) return;

    const sourceTasks = Array.from(sourceCol.tasks);
    const destTasks = Array.from(destCol.tasks);
    const [movedTask] = sourceTasks.splice(source.index, 1);

    if (sourceCol.id === destCol.id) {
      sourceTasks.splice(destination.index, 0, movedTask);

      setBoardState((prev) => ({
        ...prev,
        columns: prev.columns.map((col) => {
          if (col.id === sourceCol.id) {
            return { ...col, tasks: sourceTasks, count: sourceTasks.length };
          }
          return col;
        }),
      }));
    } else {
      movedTask.status = statusMap[destination.droppableId];
      destTasks.splice(destination.index, 0, movedTask);

      const newBoard = {
        ...boardState,
        columns: boardState.columns.map((col) => {
          if (col.id === sourceCol.id) {
            return { ...col, tasks: sourceTasks, count: sourceTasks.length };
          }
          if (col.id === destCol.id) {
            return { ...col, tasks: destTasks, count: destTasks.length };
          }
          return col;
        }),
      };

      setBoardState(newBoard);

      if (!movedTask._id.startsWith("temp-")) {
        onStatusUpdate(movedTask._id, statusMap[destination.droppableId]);
      }
    }
  };

  return {
    board: boardState,
    handleDragEnd,
    statusColumns,
  };
};
