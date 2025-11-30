import { CircularProgress } from "@mui/material";
import { Upload, Trash } from "lucide-react";
import { toast } from "react-toastify";
import { deleteProjectImage } from "../../../../api/project";

function ProjectImageUpload({
  imagePreview,
  existingImage,
  onFileChange,
  isDeletingImage,
  setIsDeletingImage,
  setImagePreview,
  setNewProject,
  projectToEdit,
  user,
  isLoading,
}) {
  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileChange(file);
    }
  };

  const handleDeleteImage = async () => {
    setIsDeletingImage(true);
    try {
      if (existingImage?.[0]?.public_id) {
        await deleteProjectImage(
          user._id,
          projectToEdit._id,
          existingImage[0].public_id
        );
      }
      toast.success("Image removed successfully");
      setImagePreview(null);
      setNewProject((prev) => ({
        ...prev,
        imageFile: null,
        existingImage: [],
      }));
    } catch (error) {
      toast.error("Failed to remove image");
      console.error("Delete image error:", error);
    } finally {
      setIsDeletingImage(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mb-4">
      {existingImage.length > 0 || imagePreview ? (
        <div className="relative mb-3 w-4/6">
          {existingImage.length > 0 ? (
            <img
              src={existingImage?.[0]?.url || imagePreview}
              alt="Project preview"
              className="rounded-3xl h-40 w-full object-cover"
            />
          ) : imagePreview[0] ? (
            <img
              src={imagePreview}
              alt="Project preview"
              className="rounded-3xl h-40 w-full object-cover"
            />
          ) : (
            <img
              src="https://media.istockphoto.com/id/1409329028/vector/no-picture-available-placeholder-thumbnail-icon-illustration-design.jpg?s=612x612&w=0&k=20&c=_zOuJu755g2eEUioiOUdz_mHKJQJn-tDgIAhQzyeKUQ="
              alt="Project preview"
              className="rounded-3xl h-40 w-full object-cover"
            />
          )}

          {existingImage.length === 0 ? null : (
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
          )}
        </div>
      ) : null}

      <label
        htmlFor="projectImage"
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
        id="projectImage"
        name="image"
        onChange={handleFileInputChange}
        disabled={isLoading || isDeletingImage}
      />
    </div>
  );
}

export default ProjectImageUpload;
