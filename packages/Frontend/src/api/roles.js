import { API } from "./api";

export const getRoles = async (user_id, projectId) => {
  const res = await API.get(`/${user_id}/projects/${projectId}/roles`);
  return res.data;
};

export const createRole = async (user_id, projectId, roleData) => {
  const res = await API.post(
    `/${user_id}/projects/${projectId}/roles`,
    roleData,
  );
  return res.data;
};

export const updateRole = async (user_id, projectId, roleId, roleData) => {
  const res = await API.patch(
    `/${user_id}/projects/${projectId}/roles/${roleId}`,
    roleData,
  );
  return res.data;
};

export const deleteRole = async (user_id, projectId, roleId) => {
  const res = await API.delete(
    `/${user_id}/projects/${projectId}/roles/${roleId}`,
  );
  return res.data;
};

export const getRoleById = async (user_id, projectId, roleId) => {
  const res = await API.get(
    `/${user_id}/projects/${projectId}/roles/${roleId}`,
  );
  return res.data;
};
