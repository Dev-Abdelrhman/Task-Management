import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import TaskImageUpload from "./TaskImageUpload";
import PrioritySelect from "./PrioritySelect";

const AddProjectTask = ({
  closeModal,
  onAddTask,
  editTask,
  statusFromColumn,
}) => {
  const [status, setStatus] = useState(statusFromColumn || "Pending");
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("Normal");
  const [disablePriority, setDisablePriority] = useState(false);

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState([]);

  useEffect(() => {
    if (editTask) {
      setTaskName(editTask.title || "");
      setDescription(editTask.description || "");
      setDueDate(editTask.dueDate ? editTask.dueDate.substring(0, 10) : "");
      setStatus(editTask.status || "Pending");
      setPriority(editTask.priority || "Normal");
      setDisablePriority(!!editTask.priority);
      setImagePreview(editTask.image?.[0]?.url || editTask.image || null);
      setExistingImage(editTask.image || []);
    } else if (statusFromColumn) {
      setStatus(statusFromColumn);
      setDisablePriority(false);
    } else {
      setTaskName("");
      setDescription("");
      setDueDate("");
      setStatus("Pending");
      setPriority("Normal");
      setDisablePriority(false);
      setImagePreview(null);
      setImageFile(null);
      setExistingImage([]);
    }
  }, [editTask, statusFromColumn]);

  const handleFileChange = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(file);
        setExistingImage([]);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove = () => {
    setImagePreview(null);
    setImageFile(null);
    setExistingImage([]);
  };

  const createFormData = () => {
    const formData = new FormData();
    formData.append("title", taskName || "");
    formData.append("description", description || "");
    if (dueDate) formData.append("dueDate", new Date(dueDate).toISOString());
    formData.append("status", status || "Pending");
    formData.append("priority", priority || "Normal");

    if (imageFile instanceof File) {
      formData.append("image", imageFile);
    } else if (editTask && imagePreview && !imageFile) {
      const existingImage = editTask.image?.[0];
      if (existingImage) {
        formData.append("image", JSON.stringify([existingImage]));
      }
    }

    return formData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!taskName.trim()) return;

    try {
      const formData = createFormData();
      await onAddTask(formData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      onClick={closeModal}
    >
      <div
        className="
          bg-white dark:bg-[#080808]
          w-full max-w-[600px]
          max-h-[90vh]
          overflow-y-auto
          shadow-lg 
          rounded-xl
          p-6
          relative
        "
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={closeModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-300 dark:hover:text-gray-100 text-xl"
        >
          ✖
        </button>

        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-300 mb-4">
          {editTask ? "Edit Task" : "Add New Task"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Image Upload */}
          <TaskImageUpload
            imagePreview={imagePreview}
            existingImage={existingImage}
            onFileChange={handleFileChange}
            onImageRemove={handleImageRemove}
            isLoading={loading}
          />

          {/* Task Name */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-400 mb-1">
              Task Name
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              className="w-full p-2 dark:bg-[#2D2D2D] dark:text-gray-300 border border-gray-300 rounded"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-400 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows="4"
              className="w-full p-2 dark:bg-[#2D2D2D] dark:text-gray-300 border border-gray-300 rounded"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-400 mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={!!statusFromColumn && !editTask}
              className="w-full p-2 dark:bg-[#2D2D2D] dark:text-gray-300 border border-gray-300 rounded"
            >
              <option value="Pending">Pending</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Done</option>
            </select>
          </div>

          {/* Priority */}
          <PrioritySelect priority={priority} onPriorityChange={setPriority} />

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-800 dark:text-gray-400 mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 dark:bg-[#2D2D2D] dark:text-gray-300 border border-gray-300 rounded"
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="
                !bg-[#546FFF] 
                !text-white 
                !font-semibold 
                !py-3 
                !px-7 
                !rounded-xl 
                hover:shadow-lg hover:shadow-[#546FFF]
              "
            >
              {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}
              {editTask ? "Save Changes" : "Add Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProjectTask;
