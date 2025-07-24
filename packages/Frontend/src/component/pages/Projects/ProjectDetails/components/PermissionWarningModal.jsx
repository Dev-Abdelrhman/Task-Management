import { Button } from "@mui/material";

const PermissionWarningModal = ({ open, onClose, onConfirm }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white !rounded-xl p-6 w-[400px]">
        <h2 className="text-xl font-medium mb-4">
          Warning: Removing Last Permission
        </h2>
        <p className="mb-6 text-gray-600">
          You are about to remove your last permission from this role. This will
          remove your access to this project. Are you sure you want to continue?
        </p>
        <div className="flex justify-end gap-3">
          <Button
            onClick={onClose}
            className="!text-sm !capitalize !bg-gray-100 !text-gray-700 hover:!bg-gray-200 !h-9 !px-4 !rounded-[7px]"
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            className="!text-sm !capitalize !bg-red-600 hover:shadow-lg hover:shadow-red-500 hover:!bg-red-500 !text-white !h-9 !px-4 !rounded-[7px]"
          >
            Continue
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PermissionWarningModal; 