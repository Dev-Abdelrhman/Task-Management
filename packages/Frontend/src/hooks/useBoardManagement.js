import { useBoardState } from "./useBoardState";
import { useDragAndDrop } from "./useDragAndDrop";

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
  const { board, setBoard } = useBoardState(data, searchTerm);
  const { handleDragEnd } = useDragAndDrop(board, setBoard, onStatusUpdate);

  return {
    board,
    handleDragEnd,
    statusColumns,
  };
}; 