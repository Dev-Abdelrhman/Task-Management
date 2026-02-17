import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import TaskImageUpload from "../../Projects/ProjectModals/TaskImageUpload";
import PrioritySelect from "../../Projects/ProjectModals/PrioritySelect";

const AddTask = ({ closeModal, onAddTask, editTask, statusFromColumn }) => {
  const [status, setStatus] = useState(statusFromColumn || "Pending");
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("Normal");
  const [disablePriority, setDisablePriority] = useState(false);

  // States for image handling
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 sm:p-0">
      <div className="bg-white dark:bg-[#080808] shadow-lg p-6 w-full max-w-[700px] relative rounded-xl max-h-[95vh] max-sm:overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={closeModal}
            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-xl"
          >
            ✖
          </button>

          <h2 className="text-xl dark:text-gray-300 font-semibold">
            {editTask ? "Edit Task" : "Add New Task"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ===== IMAGE UPLOAD ===== */}
          <TaskImageUpload
            imagePreview={imagePreview}
            existingImage={existingImage}
            onFileChange={handleFileChange}
            onImageRemove={handleImageRemove}
            isLoading={loading}
          />

          {/* ===== TASK NAME ===== */}
          <div>
            <label className="block dark:text-gray-300 text-sm font-medium mb-1">
              Task Name
            </label>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task Name"
              className="w-full p-2 dark:bg-[#2D2D2D] dark:text-gray-300 border border-gray-300 rounded"
              required
            />
          </div>

          {/* ===== DESCRIPTION ===== */}
          <div>
            <label className="block dark:text-gray-300 text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Task Description"
              className="w-full p-2 dark:bg-[#2D2D2D] dark:text-gray-300 border border-gray-300 rounded"
              rows="4"
            />
          </div>

          {/* ===== STATUS ===== */}
          <div>
            <label className="block dark:text-gray-300 text-sm font-medium mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 dark:bg-[#2D2D2D] dark:text-gray-300 border border-gray-300 rounded"
              disabled={!!statusFromColumn && !editTask}
            >
              <option value="Pending">Pending</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Done</option>
            </select>
          </div>

          {/* ===== PRIORITY ===== */}
          <div>
            <PrioritySelect
              priority={priority}
              onPriorityChange={setPriority}
              disabled={disablePriority}
            />
          </div>

          {/* ===== DUE DATE ===== */}
          <div>
            <label className="block dark:text-gray-300 text-sm font-medium mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 dark:bg-[#2D2D2D] dark:text-gray-300 border border-gray-300 rounded"
              required
            />
          </div>

          {/* ===== SUBMIT BUTTON ===== */}
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={loading}
              className="!flex items-center justify-center gap-2 !text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl w-full sm:w-auto"
            >
              {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
              )}
              {editTask ? "Save Changes" : "Add Task"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;
