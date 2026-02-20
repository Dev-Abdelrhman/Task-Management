import { API } from "@/api/api";

export const updateUserInfo = async (userInfo) => {
  await API.patch("/updateMe", userInfo);
};

export const removeUserImage = async (userID, public_id) => {
  await API.patch(`/${userID}/removeImage`, { public_id });
};

export const updateUserPassword = async (password) => {
  await API.patch("/updateMyPassword", password);
};

export const deleteUser = async () => {
  await API.delete("/deleteMe");
};

export default API;
