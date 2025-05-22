export const useDragAndDrop = (board, setBoard, onStatusUpdate) => {
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
      onStatusUpdate(movedTask._id, destCol.status);
    }
  };

  return { handleDragEnd };
}; 