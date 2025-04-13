import API from "./auth";
export const getUserProjects = async (user_id) => {
  const res = await API.get(`${user_id}/projects`, { withCredentials: true });
  return res.data;
};

export const addProject = async (user_id, projectData) => {
  await API.post(`${user_id}/projects`, projectData, { withCredentials: true });
};

export default API;
