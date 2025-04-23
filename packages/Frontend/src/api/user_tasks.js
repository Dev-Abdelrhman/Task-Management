import API from "./auth";
const BASE_URL = "http://localhost:9999/depiV1";

export const getAllUserTasks = async () => {
  const res = await API.get(`${BASE_URL}/tasks/userTasks`, {
    withCredentials: true,
  });
  return res.data;
};

export const createTask = async (taskData) => {
  const res = await fetch(`${BASE_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
};

// export const deleteTask = async (id) => {
//   const res = await fetch(`${BASE_URL}/tasks/${id}`, {
//     method: "DELETE",
//     credentials: "include",
//   });
//   if (!res.ok) throw new Error("Failed to delete task");
//   return res.json();
// };
export const deleteTask = async (id) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "DELETE",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Failed to delete task");
  // bec the respnse is empty
  if (res.status === 204) return {}; // 204 No Content

  return res.json();
};

// export const getAllUserTasks = async () => {
//   const res = await API.get("/userTasks", { withCredentials: true });
//   return res.data;
// };
export const updateTask = async (id, taskData) => {
  const res = await fetch(`${BASE_URL}/tasks/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(taskData),
    credentials: "include",
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
};
