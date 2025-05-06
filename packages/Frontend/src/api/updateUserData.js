import API from "./auth";

// 1. Get User Info for Auth
export const getUserInfoForAuth = async () => {
  const response = await API.get("/google/user");
  return response.data;
};

// 2. Get User Information for Profile
export const getUserInfoForProfile = async () => {
  const response = await API.get("/me");
  return response.data;
};

// 3. Update User Information name, username, email, image
export const updateUserInfo = async (userInfo) => {
  const response = await API.patch("/updateMe", { userInfo });
  return response.data;
};

// 4. Update User Password
export const updateUserPassword = async (password) => {
  const response = await API.patch("/updateMyPassword",  password );
  return response.data;
};

// 5. Remove User Image
export const removeUserImage = async (userID, public_id) => {
  const response = await API.patch(`/${userID}/removeImage`, {
    public_id,
  });
  return response.data;
};

// 6. Delete User
export const deleteUser = async () => {
  const response = await API.delete("/deleteMe");
  return response.data;
};

export default API;
