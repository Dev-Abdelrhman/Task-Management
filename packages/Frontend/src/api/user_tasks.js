import API from "./auth";
const BASE_URL = "http://localhost:9999/depiV1";

// Get all user tasks
export const getAllUserTasks = async () => {
  try {
    const res = await API.get(`${BASE_URL}/tasks/userTasks`, { withCredentials: true });
    console.log("User tasks fetched successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching user tasks:", error.response?.data || error.message);
    throw error;
  }
};

// Create a new task
export const createTask = async (taskData) => {
  try {
    console.log("Creating task:", taskData);

    const res = await API.post(`${BASE_URL}/tasks`, taskData, { withCredentials: true });
    console.log("Task created successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message);
    throw error;
  }
};

// Update a task
export const updateTask = async (id, taskData) => {
  try {
    console.log("Updating task:", id, taskData);

    const res = await API.patch(`${BASE_URL}/tasks/${id}`, taskData, { withCredentials: true });
    console.log("Task updated successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating task:", error.response?.data || error.message);
    throw error;
  }
};

// Delete a task
export const deleteTask = async (id) => {
  try {
    console.log("Deleting task:", id);

    const res = await API.delete(`${BASE_URL}/tasks/${id}`, { withCredentials: true });
    console.log("Task deleted successfully");
    return res.data || {}; 
  } catch (error) {
    console.error("Error deleting task:", error.response?.data || error.message);
    throw error;
  }
};
