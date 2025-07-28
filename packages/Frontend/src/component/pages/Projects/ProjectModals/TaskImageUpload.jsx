import { CircularProgress } from "@mui/material";
import { Upload, Trash } from "lucide-react";
import { useState } from "react";

function TaskImageUpload({
  imagePreview,
  existingImage,
  onFileChange,
  onImageRemove,
  isLoading,
}) {
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleDeleteImage = async () => {
    setIsDeletingImage(true);
    try {
      await onImageRemove();
    } catch (error) {
      console.error("Delete image error:", error);
    } finally {
      setIsDeletingImage(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mb-4">
      {(existingImage?.length > 0 || imagePreview?.length > 0) ? (
        <div className="relative mb-3 w-1/2">
          <img
            src={existingImage?.length > 0 ? existingImage[0].url : imagePreview}
            alt="Task preview"
            className="rounded-3xl h-40 w-full object-cover"
          />
          <button
            type="button"
            onClick={handleDeleteImage}
            className="absolute -right-8 bottom-1 p-1 rounded-full"
            disabled={isLoading || isDeletingImage}
          >
            {isDeletingImage ? (
              <CircularProgress size={24} sx={{ color: "#dc2626" }} />
            ) : (
              <Trash className="w-5 h-5 text-red-600 " />
            )}
          </button>
        </div>
      ) : (<div className="relative mb-3">
        <img
          src="https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
          alt="Task preview"
          className="rounded-3xl h-40 w-full object-cover"
        />
      </div>)}

      <label
        htmlFor="taskImage"
        className={`flex gap-2 p-2 justify-center cursor-pointer border border-dashed border-gray-400 px-4 py-3 rounded-[10px] bg-[#f8f8f8] mb-1 text-border font-medium ${
          isLoading || isDeletingImage
            ? "text-gray-400 cursor-not-allowed"
            : "text-gray-700"
        }`}
      >
        Upload image
        <Upload />
      </label>
      <input
        type="file"
        className="hidden"
        id="taskImage"
        name="image"
        onChange={handleFileInputChange}
        disabled={isLoading || isDeletingImage}
      />
    </div>
  );
}

export default TaskImageUpload; 