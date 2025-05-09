import API from "./auth";

export const getAllSenderInvite = async (userId) => {
  const response = await API.get(`/${userId}/invite/sender`);
  return response.data;
};

export const getAllReceiverInvite = async (userId) => {
  const response = await API.get(`/${userId}/invite/receiver`);
  return response.data;
};

export const searchForUser = async (userId, username) => {
  const response = await API.get(`/${userId}/invite/search`, {
    params: { username },
  });
  return response.data;
};

export const deleteInvite = async (userId, inviteId) => {
  await API.delete(`/${userId}/invite/${inviteId}`);
};

export const declineInvite = async (userId, inviteId) => {
  await API.post(`/${userId}/invite/${inviteId}/decline`);
};

export const acceptInvite = async (userId, inviteId) => {
  await API.post(`/${userId}/invite/${inviteId}/accept`);
};

export const sendInvite = async (userId, projectId, inviteData) => {
  await API.post(
    `/${userId}/projects/${projectId}/invite/sendInvite`,
    inviteData
  );
};
// فايل هوك يشغل ملف ده زي ده 