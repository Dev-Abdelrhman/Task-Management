import React, { useState } from 'react';
import { Ban, Calendar, CircleAlert, SignalHigh, SignalLow, SignalMedium, Trash, Upload, X } from 'lucide-react';
import { Button, CircularProgress, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const AddTask = ({ closeModal, onAddTask, initialStatus, initialData, isEditing, disableStatus }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate?.split('T')[0] || '');
  const [status, setStatus] = useState(initialStatus || 'Pending');
  const [priority, setPriority] = useState('Normal');
  const [loading, setLoading] = useState(false)

  // States for image handling
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(
    initialData?.image?.[0]?.url || initialData?.image || null
  );
  const [isDeletingImage, setIsDeletingImage] = useState(false);


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
      toast.success("Image removed successfully");
    } catch (error) {
      toast.error("Failed to remove image");
      console.error("Delete image error:", error);
    } finally {
      setIsDeletingImage(false);
    }
  };
  const createFormData = () => {
    const formData = new FormData();
    formData.append('title', title || '');
    formData.append('description', description || '');
    if (dueDate) formData.append('dueDate', new Date(dueDate).toISOString());
    formData.append('status', status || 'Pending');
    formData.append('priority', priority || 'Normal');

    if (imageFile instanceof File) {
      formData.append('image', imageFile);
    } else if (isEditing && imagePreview && !imageFile) {
      formData.append('image', 'keep');
    }

    return formData;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = createFormData();
      await onAddTask(formData);
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white dark:bg-[#121212] rounded-lg shadow-lg p-6 w-[700px] relative !rounded-xl">
        {/* <div className="bg-white w-[426px] rounded-[10px] shadow-lg p-6"> */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-500 dark:text-gray-400 text-2xl font-medium">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
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
              className={`flex gap-2 p-2 justify-center cursor-pointer border border-dashed border-gray-400 px-4 py-3 rounded-[10px] bg-[#f8f8f8] mb-1 text-border font-medium ${loading || isDeletingImage
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

          <div className="mb-4">
            <label className="block dark:text-gray-400 text-gray-700 text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-300 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
              disabled={loading || isDeletingImage}
            />
          </div>

          <div className="mb-4">
            <label className="block dark:text-gray-400 text-gray-700 text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-300 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block dark:text-gray-400 text-gray-700 text-sm font-medium mb-1">Due Date</label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-300 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mb-6">
            <label className="block dark:text-gray-400 text-gray-700 text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full px-3 py-2 dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-300 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${disableStatus ? 'bg-gray-100 text-gray-500' : ''
                }`}
              disabled={disableStatus}
            >
              <option className='dark:text-gray-400' value="Pending">Pending</option>
              <option className='dark:text-gray-400' value="Todo">Todo</option>
              <option className='dark:text-gray-400' value="In Progress">In Progress</option>
              <option className='dark:text-gray-400' value="Completed">Completed</option>
            </select>
          </div>
          <div className="mb-6">
            <FormControl fullWidth>
              <label className="block dark:text-gray-400 text-gray-700 text-sm font-medium mb-1">Priority</label>

              <InputLabel id="status-label">Priority</InputLabel> {/* Changed label to Priority */}
              <Select
                labelId="status-label"
                id="status-select"
                value={priority}
                label="Priority"
                className='dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-300'
                onChange={(e) => setPriority(e.target.value)}
                // disabled={disableStatus}
                renderValue={(value) => {
                  const iconMap = {
                    Urgent: <CircleAlert size={18} className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-red-600/20 text-red-500 border-red-600" />,
                    High: <SignalHigh size={18} className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-orange-500/20 text-orange-500 border-orange-500" />,
                    Medium: <SignalMedium size={18} className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-yellow-500/20 text-yellow-500 border-yellow-500" />,
                    Low: <SignalLow size={18} className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-blue-500 text-blue-300 border-blue-300" />,
                    Normal: <Ban size={18} className=" mr-1 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-gray-500 text-gray-200 border-gray-300" />
                  };
                  return (
                    <span className="flex dark:text-gray-400 items-center gap-2">
                      {iconMap[value]} {value}
                    </span>
                  );
                }}
              >
                <MenuItem className='dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500' value="Urgent">
                  <CircleAlert size={18} className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-red-600/20 text-red-500 border-red-600" />

                  Urgent
                </MenuItem>
                <MenuItem className='dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500' value="High">
                  <SignalHigh size={18} className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-orange-500/20 text-orange-500 border-orange-500" /> High
                </MenuItem>
                <MenuItem className='dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500' value="Medium">
                  <SignalMedium size={18} className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-yellow-500/20 text-yellow-500 border-yellow-500" /> Medium
                </MenuItem>
                <MenuItem className='dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500' value="Low">
                  <SignalLow size={18} className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-blue-500 text-blue-300 border-blue-300" /> Low
                </MenuItem>
                <MenuItem className='dark:text-gray-400 dark:bg-[#2D2D2D] dark:border-gray-500' value="Normal">
                  <Ban size={18} className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-gray-500 text-gray-200 border-gray-300" /> Normal
                </MenuItem>
              </Select>
              {/* Optional: you can add helper text here if needed */}
            </FormControl>
          </div>
          <div className="flex justify-end gap-4">
            <Button
              onClick={closeModal}
              className="!text-base !capitalize !bg-[#7787e2] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="!flex items-center justify-center gap-2 !text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl"
            >
              {loading && (
                <div className="w-5 h-5 border-2 border-white border-t-transparent border-solid rounded-full animate-spin"></div>
              )}
              {isEditing ? 'Update Task' : 'Add Task'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTask;