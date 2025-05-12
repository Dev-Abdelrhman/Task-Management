import { useEffect, useState } from "react";
import {
  Ban,
  Calendar,
  CircleAlert,
  SignalHigh,
  SignalLow,
  SignalMedium,
  Trash,
  Upload,
  X,
} from "lucide-react";
import {
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";

const AddProjectTask = ({ closeModal, onAddTask, editTask }) => {
  const [status, setStatus] = useState("Pending");
  const [taskName, setTaskName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [priority, setPriority] = useState("Normal");
  const [disablePriority, setDisablePriority] = useState(false);
  
  // States for image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    editTask?.image?.[0]?.url || editTask?.image || null
  );
  const [isDeletingImage, setIsDeletingImage] = useState(false);

  useEffect(() => {
    if (editTask) {
      setTaskName(editTask.title || "");
      setDescription(editTask.description || "");
      setDueDate(editTask.dueDate ? editTask.dueDate.substring(0, 10) : "");
      setStatus(editTask.status || "Pending");
      setPriority(editTask.priority || "Normal");
      setDisablePriority(!!editTask.priority);
      setImagePreview(editTask.image?.[0]?.url || editTask.image || null);
    } else {
      setTaskName("");
      setDescription("");
      setDueDate("");
      setStatus("Pending");
      setPriority("Normal");
      setDisablePriority(false);
      setImagePreview(null);
      setImageFile(null);
    }
  }, [editTask]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageFile(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setIsDeletingImage(true);
    try {
      setImagePreview(null);
      setImageFile(null);
    } catch (error) {
      console.error("Delete image error:", error);
    } finally {
      setIsDeletingImage(false);
    }
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
      // If editing and there's an existing image, send the existing image data
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white dark:bg-[#080808] shadow-lg p-6 w-[700px] relative !rounded-xl">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={closeModal}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 mt-4 mr-4"
          >
            ✖
          </button>
          <h2 className="text-xl dark:text-gray-400 font-semibold mb-4">
            {editTask ? "Edit Task" : "Add New Task"}
          </h2>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col justify-center items-center mb-4">
            {imagePreview ? (
              <div className="relative mb-3">
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
          <div className="mb-3">
            <label className="block dark:text-gray-400 text-sm font-medium mb-1">
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
          <div className="mb-3">
            <label className="block dark:text-gray-400 text-sm font-medium mb-1">
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
          <div className="mb-3">
            <label className="block dark:text-gray-400 text-sm font-medium mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full p-2 dark:bg-[#2D2D2D] border dark:text-gray-300 border-gray-300 rounded"
            >
              <option className="dark:text-gray-400" value="Pending">
                Pending
              </option>
              <option className="dark:text-gray-400" value="Todo">
                Todo
              </option>
              <option className="dark:text-gray-400" value="In Progress">
                In Progress
              </option>
              <option className="dark:text-gray-400" value="Completed">
                Done
              </option>
            </select>
          </div>
          <div className="mb-6">
            <FormControl fullWidth>
              <label className="block dark:text-gray-400 text-gray-700 text-sm font-medium mb-1">
                Priority
              </label>
              <InputLabel id="status-label">Priority</InputLabel>
              jsx
              <Select
                labelId="status-label"
                id="status-select"
                value={priority}
                label="Priority"
                className="dark:!bg-[#2D2D2D] dark:border-0 dark:border-gray-500 dark:text-gray-300"
                onChange={(e) => setPriority(e.target.value)}
                MenuProps={{
                  PaperProps: {
                    className: "dark:bg-[#2D2D2D] dark:text-gray-300",
                  },
                }}
                renderValue={(value) => {
                  const iconMap = {
                    Urgent: (
                      <CircleAlert
                        size={18}
                        className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-red-600/20 text-red-500 border-red-600"
                      />
                    ),
                    High: (
                      <SignalHigh
                        size={18}
                        className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-orange-500/20 text-orange-500 border-orange-500"
                      />
                    ),
                    Medium: (
                      <SignalMedium
                        size={18}
                        className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-yellow-500/20 text-yellow-500 border-yellow-500"
                      />
                    ),
                    Low: (
                      <SignalLow
                        size={18}
                        className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-blue-500 text-blue-300 border-blue-300"
                      />
                    ),
                    Normal: (
                      <Ban
                        size={18}
                        className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-gray-500 text-gray-200 border-gray-300"
                      />
                    ),
                  };
                  return (
                    <span className="flex dark:text-gray-300 items-center gap-2">
                      {iconMap[value]} {value}
                    </span>
                  );
                }}
              >
                <MenuItem
                  className="dark:text-gray-300 dark:bg-[#2D2D2D] hover:dark:bg-[#404040]"
                  value="Urgent"
                >
                  <CircleAlert
                    size={18}
                    className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-red-600/20 text-red-500 border-red-600"
                  />
                  Urgent
                </MenuItem>
                <MenuItem
                  className="dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500"
                  value="High"
                >
                  <SignalHigh
                    size={18}
                    className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-orange-500/20 text-orange-500 border-orange-500"
                  />{" "}
                  High
                </MenuItem>
                <MenuItem
                  className="dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500"
                  value="Medium"
                >
                  <SignalMedium
                    size={18}
                    className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-yellow-500/20 text-yellow-500 border-yellow-500"
                  />{" "}
                  Medium
                </MenuItem>
                <MenuItem
                  className="dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500"
                  value="Low"
                >
                  <SignalLow
                    size={18}
                    className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-blue-500 text-blue-300 border-blue-300"
                  />{" "}
                  Low
                </MenuItem>
                <MenuItem
                  className="dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500"
                  value="Normal"
                >
                  <Ban
                    size={18}
                    className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-gray-500 text-gray-200 border-gray-300"
                  />{" "}
                  Normal
                </MenuItem>
              </Select>
              {/* Optional: you can add helper text here if needed */}
            </FormControl>
          </div>
          <div className="mb-3">
            <label className="block dark:text-gray-400 text-sm font-medium mb-1">
              Due Date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full p-2 dark:text-gray-300 dark:bg-[#2D2D2D] border border-gray-300 rounded"
              required
            />
          </div>
          <div className="flex justify-end mt-4">
            <Button
              type="submit"
              disabled={loading}
              className="!flex items-center justify-center gap-2 !text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
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

export default AddProjectTask;
