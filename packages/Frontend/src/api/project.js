import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:9999/depiV1/users/",
  withCredentials: true,
});

export const getUserProjects = async (user_id) => {
  const res = await API.get(`${user_id}/projects`, { withCredentials: true });
  console.log(res);
  return res.data;
};

export const addProject = async (user_id, projectData) => {
  const res = await API.post(`${user_id}/projects`, projectData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return res.data;
};

export default API;
