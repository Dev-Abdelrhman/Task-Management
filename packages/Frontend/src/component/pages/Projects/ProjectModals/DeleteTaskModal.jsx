import { CircleAlert } from "lucide-react";
import { Button } from "@mui/material";

const DeleteTaskModal = ({ onClose, onDelete, isDeleting }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white flex flex-col items-center justify-center w-[426px] rounded-[10px] shadow-lg p-6 dark:bg-[#080808]">
        <CircleAlert size={40} color="#f8bb86" />
        <h2 className="text-gray-500 text-4xl dark:text-gray-300 font-medium mt-4 mb-4">
          Delete Task
        </h2>
        <div className="text-gray-600 dark:text-gray-400 mb-[24px]">
          Are you sure you want to delete this task?
        </div>
        <div className="flex justify-end gap-4">
          <Button
            onClick={onClose}
            className="!text-base !capitalize !bg-[#7787e2] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            className="!text-base !capitalize !bg-red-500 hover:shadow-lg hover:shadow-red-500 !font-bold !text-white !py-3 !px-7 !rounded-xl"
          >
            {isDeleting ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin mr-2"></div>{" "}
                Deleting
              </div>
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteTaskModal;
