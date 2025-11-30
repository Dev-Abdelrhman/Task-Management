const User = require("../../models/user.Model.js");
const catchAsync = require("../../utils/catchAsync.js");

const searchUsersForInvite = catchAsync(async (req, res, next) => {
  const { username } = req.query;
  const currentUserId = req.user._id;

  const users = await User.find({
    username: { $regex: new RegExp(username, "i") },
    _id: { $ne: currentUserId },
  }).select("username name image");

  if (users.length === 0) {
    return res.status(404).json({ status: "fail", message: "No users found" });
  }

  res.status(200).json({ status: "success", data: users });
});

module.exports = {
  searchUsersForInvite,
};
