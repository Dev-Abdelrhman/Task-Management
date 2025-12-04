import { CircularProgress, Button, Avatar } from "@mui/material";
import { Trash, Upload, X } from "lucide-react";

const ImageUpdateModal = ({
  showImageModal,
  setShowImageModal,
  imagePreview,
  fileInputRef,
  handleFileChange,
  handleRemoveImage,
  handleUpdateImage,
  isRemovingImage,
  userData,
  isImageUploading,
}) => {
  if (!showImageModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-[#080808] !rounded-xl shadow-md p-6 sm:w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold dark:text-gray-200">
            Update Profile Picture
          </h3>
          <button
            onClick={() => setShowImageModal(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 mb-6">
          <div className="w-32 h-32 rounded-full overflow-hidden relative border-2 border-gray-200 dark:border-gray-600">
            <Avatar
              src={imagePreview}
              alt="Profile preview"
              className="!w-full !h-full object-cover"
            />
          </div>

          <input
            type="file"
            hidden
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
          />
          <Button
            onClick={() => fileInputRef.current.click()}
            className="w-full !capitalize !text-base !text-white !py-2 hover- !bg-[#546FFF] hover:!shadow-lg hover:!shadow-[#546FFF]"
            startIcon={<Upload className="w-4 h-4 !text-base" />}
          >
            Select Image
          </Button>

          {userData.image?.length > 0 && (
            <Button
              onClick={handleRemoveImage}
              className="w-full !capitalize !text-base !text-white !py-2 !bg-red-600 hover:!bg-red-500 hover:!shadow-lg hover:!shadow-red-400"
              startIcon={<Trash className="w-4 h-4" />}
              disabled={isRemovingImage}
            >
              {isRemovingImage ? (
                <CircularProgress size={20} />
              ) : (
                "Remove Image"
              )}
            </Button>
          )}
        </div>

        <div className="flex !flex-row !justify-end gap-4">
          <Button
            onClick={() => setShowImageModal(false)}
            variant="outlined"
            className="dark:text-gray-200 sm:w-2/5 max-sm:!text-[15px] max-sm:!py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateImage}
            variant="contained"
            className="!bg-[#546FFF] sm:w-2/5"
            disabled={isRemovingImage || !imagePreview || isImageUploading}
          >
            {isImageUploading ? (
              <CircularProgress size={24} sx={{ color: "white" }} />
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ImageUpdateModal;
