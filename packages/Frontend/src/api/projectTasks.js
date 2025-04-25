import API from "./auth" 
const BASE_URL = "http://localhost:9999/depiV1"

// Get all project tasks for a specific user and project
export const getAllProjectTasks = async (userId, projectId) => {
  try {
    console.log("Fetching tasks for user:", userId, "project:", projectId)
    
    const res = await API.get(`/${userId}/projects/${projectId}/tasks`, {
      withCredentials: true,
    })
    console.log("Tasks fetched successfully:", res.data)
    return res.data
  } catch (error) {
    console.error("Error fetching tasks:", error)
    throw error
  }
}

// Create a new project task
export const createProjectTask = async (userId, projectId, taskData) => {
  try {
    console.log("Creating task for user:", userId, "project:", projectId, "data:", taskData)
    
    const res = await API.post(`/${userId}/projects/${projectId}/tasks`, taskData, {
      withCredentials: true,
    })
    console.log("Task created successfully:", res.data)
    return res.data
  } catch (error) {
    console.error("Error creating task:", error.response?.data || error.message)
    throw error
  }
}

// Update a task status
export const updateTaskStatus = async (userId, projectId, taskId, status) => {
  try {
    console.log("Updating task status:", taskId, "to", status)
    
    const res = await API.patch(
      `${userId}/projects/${projectId}/tasks/${taskId}`,
      { status },
      { withCredentials: true },
    )
    console.log("Task status updated successfully:", res.data)
    return res.data
  } catch (error) {
    console.error("Error updating task status:", error)
    throw error
  }
}

export const deleteTaskStatus = async (userId, projectId, taskId, status) => {
  try {
    console.log("Deleting task status:", taskId, "to", status)
    
    const res = await API.delete(
      `${userId}/projects/${projectId}/tasks/${taskId}`,
      { status },
      { withCredentials: true },
    )
    console.log("Task deleted successfully:", res.data)
    return res.data
  } catch (error) {
    console.error("Error deleted task status:", error)
    throw error
  }
}

