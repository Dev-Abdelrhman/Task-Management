import { API } from "../../../api/api";
const BASE_URL = "http://localhost:9999/depiV1/tasks";

// Get all user tasks
export const getAllUserTasks = async () => {
  const res = await API.get(`${BASE_URL}/userTasks`, { withCredentials: true });
  return res.data;
};

// Create a new task
export const createTask = async (taskData) => {
  const res = await API.post(`${BASE_URL}`, taskData, {
    withCredentials: true,
  });
  return res.data;
};

// Update a task
export const updateTask = async (id, taskData) => {
  const res = await API.patch(`${BASE_URL}/${id}`, taskData, {
    withCredentials: true,
  });
  return res.data;
};

// Get task by ID
export const getTaskById = async (id) => {
  const res = await API.get(`${BASE_URL}/${id}`, { withCredentials: true });
  return res.data;
};

// Delete a task
export const deleteTask = async (id) => {
  const res = await API.delete(`${BASE_URL}/${id}`, { withCredentials: true });
  return res.data;
};
