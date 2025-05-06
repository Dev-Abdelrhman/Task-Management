import { useEffect, useState } from "react"
import { Ban, Calendar, CircleAlert, SignalHigh, SignalLow, SignalMedium, X } from 'lucide-react';
import { Button, FormControl, InputLabel, MenuItem, Select } from '@mui/material';


const AddProjectTask = ({closeModal, onAddTask,editTask}) => {
    const [status, setStatus] = useState("Pending");
    const [taskName, setTaskName] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)
    const [priority, setPriority] = useState(  'Normal')
    

    useEffect(() => {
        if (editTask) {
            setTaskName(editTask.title || "")
            setDescription(editTask.description || "")
            setDueDate(editTask.dueDate ? editTask.dueDate.substring(0, 10) : "")
            setStatus(editTask.status || "Pending")

        }
    }, [editTask])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true);

        if (!taskName.trim()) return

        const taskData = {
            title: taskName,
            description: description.trim() || "",
            dueDate: dueDate,
            status: status,
        }
        try {
            await onAddTask(taskData);
        } finally {
            setLoading(false);
        }
        // console.log("Submitting task with data:", taskData)
        // onAddTask(taskData)
    }

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[700px] relative !rounded-xl">
                <div className="flex justify-between items-center mb-4">
                    <button
                        onClick={closeModal}
                        className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 mt-4 mr-4"
                    >
                        ✖
                    </button>
                    <h2 className="text-xl font-semibold mb-4">{editTask ? "Edit Task" : "Add New Task"}</h2>
                </div>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Task Name</label>
                        <input
                            type="text"
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                            placeholder="Task Name"
                            className="w-full p-2 border border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Description</label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Task Description"
                            className="w-full p-2 border border-gray-300 rounded"
                            rows="4"
                        />
                    </div>
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Status</label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        >
                            <option value="Pending">Pending</option>
                            <option value="Todo">Todo</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Done</option>
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
                    <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Due Date</label>
                        <input
                            type="date"
                            value={dueDate}
                            onChange={(e) => setDueDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded"
                        />
                    </div>
                    <div className="flex justify-end mt-4">
                        {/* <Button
                        type="submit"
                        className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !py-3 !px-7 !rounded-xl">
                        Save
                    </Button> */}
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
}

export default AddProjectTask
