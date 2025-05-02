import React, { useState } from 'react';
import { Ban, Calendar, CircleAlert, SignalHigh, SignalLow, SignalMedium, X } from 'lucide-react';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';

const AddTask = ({ closeModal, onAddTask, initialStatus, initialData, isEditing, disableStatus }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [dueDate, setDueDate] = useState(initialData?.dueDate?.split('T')[0] || '');
  const [status, setStatus] = useState(initialStatus || 'Pending');
  const [priority, setPriority] = useState(  'Normal');
  const [loading, setLoading] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const taskData = {
      title,
      description,
      dueDate: dueDate ? new Date(dueDate).toISOString() : null,
      status,
      priority
    };

    try {
      await onAddTask(taskData);
    } finally {
      setLoading(false);
    }
    // onAddTask(taskData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-[700px] relative !rounded-xl">
        {/* <div className="bg-white w-[426px] rounded-[10px] shadow-lg p-6"> */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-gray-500 text-2xl font-medium">
            {isEditing ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button onClick={closeModal} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-1">Due Date</label>
            <div className="relative">
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Calendar className="absolute right-3 top-2.5 text-gray-400" size={18} />
            </div>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-1">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${disableStatus ? 'bg-gray-100 text-gray-500' : ''
                }`}
              disabled={disableStatus}
            >
              <option value="Pending">Pending</option>
              <option value="Todo">Todo</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          <div className="mb-6">
            <FormControl fullWidth>
              <InputLabel id="status-label">Priority</InputLabel> {/* Changed label to Priority */}
              <Select
                labelId="status-label"
                id="status-select"
                value={priority}
                label="Priority"
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
                    <span className="flex items-center gap-2">
                      {iconMap[value]} {value}
                    </span>
                  );
                }}
              >
                <MenuItem value="Urgent">
                    <CircleAlert size={18} className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-red-600/20 text-red-500 border-red-600" />

                  Urgent
                </MenuItem>
                <MenuItem value="High">
                  <SignalHigh size={18} className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-orange-500/20 text-orange-500 border-orange-500" /> High
                </MenuItem>
                <MenuItem value="Medium">
                  <SignalMedium size={18} className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-yellow-500/20 text-yellow-500 border-yellow-500" /> Medium
                </MenuItem>
                <MenuItem value="Low">
                  <SignalLow size={18} className="mr-2 flex items-center justify-center border rounded p-0.5 flex-shrink-0 bg-blue-500 text-blue-300 border-blue-300" /> Low
                </MenuItem>
                <MenuItem value="Normal">
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