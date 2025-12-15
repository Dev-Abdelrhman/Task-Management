const US = require("../services/users-services/user.service.js");

const uploader = US.uploader;
const removeImages = US.removeImages;

const getMe = US.getMe;
const getUser = US.getUser;
const updateMe = US.updateMe;
const updatePassword = US.updatePassword;
const deleteMe = US.deleteMe;

module.exports = {
  getMe,
  getUser,
  updateMe,
  updatePassword,
  deleteMe,
  uploader,
  removeImages,
};
