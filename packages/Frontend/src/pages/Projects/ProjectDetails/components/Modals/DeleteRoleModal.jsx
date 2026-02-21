import { Button, CircularProgress } from "@mui/material";

const DeleteRoleModal = ({ open, onClose, onDelete, isDeleting }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white !rounded-xl p-6 sm:w-[400px]">
        <h2 className="text-xl font-medium mb-4">Delete Role</h2>
        <p className="mb-6">Are you sure you want to delete this role?</p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="!text-sm !capitalize !bg-gray-100 !text-gray-700 hover:!bg-gray-200 !h-9 !px-4 !rounded-[7px]"
            disabled={isDeleting}
          >
            Cancel
          </Button>
          <Button
            onClick={onDelete}
            className="!text-sm !capitalize !bg-red-600 hover:shadow-lg hover:shadow-red-500 hover:!bg-red-500 !text-white !h-9 !px-4 !rounded-[7px]"
            disabled={isDeleting}
          >
            {isDeleting ? (
              <CircularProgress size={20} sx={{ color: "white" }} />
            ) : (
              "Delete"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteRoleModal;
