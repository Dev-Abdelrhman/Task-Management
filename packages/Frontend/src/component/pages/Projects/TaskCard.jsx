import { Calendar, SquarePen, Trash2 } from "lucide-react";

const TaskCard = ({ task, onDelete, onEdit, onClick }) => {
  return (
    <div className="bg-white border dark:bg-[#2D2D2D] dark:border-0 border-gray-200 rounded-[12px] p-3 shadow-sm max-w-[350px]">
      <div className="flex justify-between items-start mb-3 border-b border-gray-200 pb-2">
        <h3
          className="text-sm dark:text-gray-200 font-medium truncate cursor-pointer"
          onClick={() => onClick(task)}
        >
          {task.title?.split(" ").length > 5
            ? task.title.split(" ").slice(0, 5).join(" ") + "..."
            : task.title}
        </h3>
        <div className="flex">
          <button
            onClick={() => onDelete(task._id)}
            className="text-red-400 hover:text-red-600"
          >
            <Trash2 width={19} height={24} />
          </button>
          <button
            onClick={() => onEdit(task)}
            className="text-gray-400 hover:text-gray-600 ml-2"
          >
            <SquarePen width={19} height={24} />
          </button>
        </div>
      </div>
      <p className="text-xs text-gray-500 dark:!text-gray-400 mb-2 truncate">
        {task.description?.split(" ").length > 5
          ? task.description.split(" ").slice(0, 5).join(" ") + "..."
          : task.description}
      </p>
      <div className="flex items-center gap-1 text-xs text-gray-500">
        <Calendar size={14} />
        <span>
          {task.dueDate
            ? new Date(task.dueDate).toLocaleDateString()
            : "No date"}
        </span>
      </div>
    </div>
  );
};

export default TaskCard; 