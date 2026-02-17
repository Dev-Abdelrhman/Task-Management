import { API } from "./api";

// Get all project tasks for a specific user and project
export const getAllProjectTasks = async (userId, projectId) => {
  try {
    console.log("Fetching tasks for user:", userId, "project:", projectId);

    const res = await API.get(`/${userId}/projects/${projectId}/tasks`, {
      withCredentials: true,
    });
    console.log("Tasks fetched successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};
export const getOneTask = async (userId, projectId, taskId) => {
  try {
    const response = await API.get(
      `/${userId}/projects/${projectId}/tasks/${taskId}`,
      {
        withCredentials: true,
      },
    );
    console.log("Task fetched successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching task:", error);
    throw error;
  }
};

// Create a new project task
export const createProjectTask = async (userId, projectId, taskData) => {
  try {
    console.log(
      "Creating task for user:",
      userId,
      "project:",
      projectId,
      "data:",
      taskData,
    );

    const res = await API.post(
      `/${userId}/projects/${projectId}/tasks`,
      taskData,
      {
        withCredentials: true,
      },
    );
    console.log("Task created successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error(
      "Error creating task:",
      error.response?.data || error.message,
    );
    throw error;
  }
};

// Update a task status
export const updateTaskStatus = async (userId, projectId, taskId, taskData) => {
  try {
    console.log("Updating task status:", taskId, "with data", taskData);

    const res = await API.patch(
      `${userId}/projects/${projectId}/tasks/${taskId}`,
      taskData,
      { withCredentials: true },
    );
    console.log("Task status updated successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error updating task status:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw error;
  }
};

export const deleteTaskStatus = async (userId, projectId, taskId, status) => {
  try {
    console.log("Deleting task status:", taskId, "to", status);

    const res = await API.delete(
      `${userId}/projects/${projectId}/tasks/${taskId}`,
      { data: { status }, withCredentials: true },
    );
    console.log("Task deleted successfully:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error deleted task status:", error);
    throw error;
  }
};
