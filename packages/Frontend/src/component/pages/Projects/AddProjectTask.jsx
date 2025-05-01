import { useState } from "react"
import { Button } from "@mui/material";

const AddProjectTask = ({ closeModal, onAddTask }) => {
    const [status, setStatus] = useState("Pending");
    const [taskName, setTaskName] = useState("")
    const [dueDate, setDueDate] = useState("")
    const [description, setDescription] = useState("")
    const [loading, setLoading] = useState(false)

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
                    <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
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
                            Add Task
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProjectTask
