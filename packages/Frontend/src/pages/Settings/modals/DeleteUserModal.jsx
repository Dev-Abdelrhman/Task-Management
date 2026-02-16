import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { Button } from "@mui/material";

const DeleteUserModal = ({
  showModal,
  onClose,
  onConfirm,
  isDeleting,
  user,
}) => {
  const [confirmationText, setConfirmationText] = useState("");

  useEffect(() => {
    if (!showModal) {
      setConfirmationText("");
    }
  }, [showModal]);

  if (!showModal) return null;

  const handleConfirm = () => {
    if (confirmationText === user?.username) {
      onConfirm();
    } else {
      toast.error("The confirmation text does not match your username.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 ">
      <div className="bg-white dark:bg-[#080808] !rounded-xl shadow-xl p-6 w-full max-w-md mx-4">
        <div className="flex justify-center mb-4">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              ></path>
            </svg>
          </div>
        </div>
        <h2 className="text-xl font-bold text-center text-gray-800 dark:text-gray-200">
          Are you sure you want to delete your account?
        </h2>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-2">
          All your projects and data will be permanently removed. This action
          cannot be undone.
        </p>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400 mt-4">
          Are you sure you wish to proceed?
        </p>

        <div className="mt-6">
          <label
            htmlFor="confirmation"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Type "<span>{user?.username}</span>" to confirm your action
          </label>
          <input
            type="text"
            id="confirmation"
            value={confirmationText}
            onChange={(e) => setConfirmationText(e.target.value)}
            className="mt-1 w-full px-3 border dark:bg-[#2D2D2D] dark:border-gray-600 dark:text-white rounded-xl py-3 border-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors"
            placeholder={`Type ${user?.username}`}
            autoComplete="off"
          />
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <Button
            onClick={onClose}
            variant="outlined"
            className="!text-gray-700 dark:!text-gray-200 !border-gray-300 dark:!border-gray-500 !px-7 !rounded-xl !text-base !capitalize"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            variant="contained"
            color="error"
            disabled={isDeleting || confirmationText !== user?.username}
            className="!text-base !capitalize !bg-red-500 hover:!shadow-lg hover:!shadow-red-500 !font-bold !text-white !py-3 !px-7 !rounded-xl disabled:!bg-red-300 disabled:!text-white"
          >
            {isDeleting ? "Deleting..." : "Delete Account"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
