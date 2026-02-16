import { Trash, Upload } from "lucide-react";
import { CircularProgress } from "@mui/material";
import { useState } from "react";

const ImageUpload = ({
  imagePreview,
  onImageChange,
  onImageRemove,
  loading,
}) => {
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageChange(reader.result, file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setIsDeletingImage(true);
    try {
      onImageRemove();
    } catch (error) {
      console.error("Delete image error:", error);
    } finally {
      setIsDeletingImage(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mb-4 ">
      {imagePreview ? (
        <div className="relative mb-3 ">
          <img
            src={imagePreview}
            alt="Task preview"
            className="rounded-3xl h-40 w-full object-cover"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -right-8 bottom-1 p-1 rounded-full"
            disabled={loading || isDeletingImage}
          >
            {isDeletingImage ? (
              <CircularProgress size={24} sx={{ color: "#dc2626" }} />
            ) : (
              <Trash className="w-5 h-5 text-red-600" />
            )}
          </button>
        </div>
      ) : null}

      <label
        htmlFor="taskImage"
        className={`flex gap-2 p-2 justify-center cursor-pointer border border-dashed border-gray-400 px-4 py-3 rounded-[10px] bg-[#f8f8f8] mb-1 text-border font-medium ${
          loading || isDeletingImage
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
        onChange={handleFileChange}
        disabled={loading || isDeletingImage}
      />
    </div>
  );
};

export default ImageUpload;
