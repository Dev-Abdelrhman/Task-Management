import { Plus } from "lucide-react";
import { Droppable, Draggable } from "react-beautiful-dnd";
import TaskCard from "./TaskCard";

const TaskColumn = ({
  column,
  onAddTask,
  onTaskClick,
  onTaskDelete,
  onTaskEdit,
}) => {
  return (
    <div className="flex-shrink-0 w-[23%]">
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
            onClick={() => onAddTask(column.id)}
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
                      >
                        <TaskCard
                          task={task}
                          onDelete={onTaskDelete}
                          onEdit={onTaskEdit}
                          onClick={onTaskClick}
                        />
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
  );
};

export default TaskColumn; 