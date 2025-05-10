import API from "./auth";

export const getUserInfoForAuth = async () => {
  const response = await API.get("/google/user");
  return response.data;
};
// Pending
export const getUserInfoForProfile = async () => {
  const response = await API.get("/me");
  return response.data?.user || response.data || {};
};

export const updateUserInfo = async (userInfo) => {
  const response = await API.patch("/updateMe", userInfo);
  return response.data?.user || response.data;
};

export const removeUserImage = async (userID, public_id) => {
  const response = await API.patch(`/${userID}/removeImage`, { public_id });
  return response.data?.user || response.data;
};
// DONE
export const updateUserPassword = async (password) => {
  const response = await API.patch("/updateMyPassword", password);
  return response.data;
};

export const deleteUser = async () => {
  const response = await API.delete("/deleteMe");
  return response.data;
};

export default API;
