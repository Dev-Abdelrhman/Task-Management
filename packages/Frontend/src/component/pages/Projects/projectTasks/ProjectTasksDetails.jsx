import {
  Ban,
  Calendar,
  CircleAlert,
  SignalHigh,
  SignalLow,
  SignalMedium,
  X,
} from "lucide-react";
import { Button } from "@mui/material";

const ProjectTasksDetails = ({ task, onClose, onEdit, onDelete }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-end">
      <div className="bg-white w-[480px] sm:rounded-[10px] dark:!bg-[#1a1a1a] h-screen shadow-lg px-6 pt-4 overflow-y-auto">
        <div className="flex justify-end items-center">
          <button className="mb-3 dark:text-red-50" onClick={onClose}>
            <X size={24} />
          </button>
        </div>
        {task?.image && (
          <div className="mb-6">
            <img
              src={
                task?.image?.[0]?.url ||
                "https://placehold.co/612x322?text=No+Image&font=roboto"
              }
              alt="Task"
              className="w-full h-auto rounded-xl"
            />
          </div>
        )}

        <div className="">
          <div>
            <h2 className="text-xl dark:text-white font-bold mb-4">
              {task?.title}
            </h2>

            <div className="mb-4">
              <h3 className="text-sm font-medium dark:text-gray-200 mb-1">
                Description :
              </h3>
              <p className="text-gray-700 dark:text-[#a0a0a0] whitespace-pre-line">
                {task?.description || "No description provided"}
              </p>
            </div>
            <h6 className="text-sm font-medium dark:text-gray-200">
              Properties :{" "}
            </h6>
            <div className="mb-4 flex gap-8 mt-3">
              <h3 className="text-sm font-medium dark:text-gray-200 text-gray-500 mb-1">
                Status
              </h3>
              <div className="flex items-center">
                <span
                  className={`px-3 py-1 rounded text-xs font-medium ${
                    task?.status === "Completed"
                      ? "bg-green-100 text-green-800"
                      : task?.status === "In Progress"
                      ? "bg-yellow-100 text-yellow-800"
                      : task?.status === "Todo"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {task?.status}
                </span>
              </div>
            </div>
            <div className="mb-4 flex gap-8 mt-3">
              <h3 className="text-sm font-medium dark:text-gray-200 text-gray-500 mb-1">
                Priority
              </h3>
              <div className="flex items-center">
                {task?.priority && (
                  <span
                    className={`flex items-center px-3 py-1 rounded text-xs font-medium
                    ${
                      task.priority === "Urgent"
                        ? "bg-red-600/20 text-red-500 border-red-600"
                        : task.priority === "High"
                        ? "bg-orange-500/20 text-orange-500 border-orange-500"
                        : task.priority === "Medium"
                        ? "bg-yellow-500/20 text-yellow-500 border-yellow-500"
                        : task.priority === "Low"
                        ? "bg-blue-500 text-blue-300 border-blue-300"
                        : task.priority === "Normal"
                        ? "bg-gray-500 text-gray-200 border-gray-300"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {
                      {
                        Urgent: (
                          <CircleAlert
                            size={18}
                            className="mr-1 border rounded p-0.5 bg-red-600/20 text-red-500 border-red-600"
                          />
                        ),
                        High: (
                          <SignalHigh
                            size={18}
                            className="mr-1 border rounded p-0.5 bg-orange-500/20 text-orange-500 border-orange-500"
                          />
                        ),
                        Medium: (
                          <SignalMedium
                            size={18}
                            className="mr-1 border rounded p-0.5 bg-yellow-500/20 text-yellow-500 border-yellow-500"
                          />
                        ),
                        Low: (
                          <SignalLow
                            size={18}
                            className="mr-1 border rounded p-0.5 bg-blue-500 text-blue-300 border-blue-300"
                          />
                        ),
                        Normal: (
                          <Ban
                            size={18}
                            className="mr-1 border rounded p-0.5 bg-gray-500 text-gray-200 border-gray-300"
                          />
                        ),
                      }[task.priority]
                    }
                    {task.priority}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div>
            <div className="mb-4 flex gap-6">
              <h3 className="text-sm font-medium dark:text-gray-200 text-gray-500 mb-1">
                Due Date
              </h3>
              <div className="flex items-center text-gray-700 dark:text-[#a0a0a0]">
                <Calendar className="mr-2" size={16} />
                {task?.dueDate
                  ? new Date(task.dueDate).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "No due date"}
              </div>
            </div>

            {task?.completedAt && (
              <div className="mb-4">
                <h3 className="text-sm font-medium dark:text-gray-200 text-gray-500 mb-1">
                  Completed At
                </h3>
                <div className="flex items-center text-gray-700">
                  <Calendar className="mr-2" size={16} />
                  {new Date(task.completedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end pt-3 pb-3 gap-2 mt-6">
          <Button
            onClick={onEdit}
            className="!flex items-center justify-center gap-2 !text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
          >
            Edit
          </Button>
          <Button
            onClick={onDelete}
            className="!text-base !capitalize !bg-red-500 hover:shadow-lg hover:shadow-red-500 !font-bold !text-white !py-3 !px-7 !rounded-xl"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTasksDetails;
