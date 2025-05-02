import API from "./auth";
export const getUserProjects = async (user_id) => {
  const res = await API.get(`${user_id}/projects`, { withCredentials: true });
  return res.data;
};
export const getProjectById = async (projectId) => {
  const res = await API.get(`/api/projects/${projectId}`, {
    withCredentials: true,
  });
  return res.data;
};

export const addProject = async (user_id, projectData) => {
  await API.post(`${user_id}/projects`, projectData, { withCredentials: true });
};

export const deleteProject = async (user_id, projectId) => {
  await API.delete(`${user_id}/projects/${projectId}`);
};

export const deleteProjectImage = async (user_id, projectId, public_id) => {
  await API.patch(`${user_id}/projects/${projectId}/removeImage`, {
    public_id,
  });
};

export const updateProject = async (projectId, updateproject) => {
  await API.patch(`/api/projects/${projectId}`, updateproject, {
    withCredentials: true,
  });
};

export default API;
