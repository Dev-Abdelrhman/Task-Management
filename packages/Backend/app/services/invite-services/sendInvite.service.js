const Invite = require("../../models/invite.Model.js");
const Project = require("../../models/project.Model.js");
const User = require("../../models/user.Model.js");
const Role = require("../../models/role.Model.js");
const catchAsync = require("../../utils/catchAsync.js");

const sendInvite = catchAsync(async (req, res, next) => {
  const { username, roleId } = req.body;
  const senderId = req.user.id;
  const senderName = req.user.name;
  const projectId = req.params.id;
  const receiver = await User.findOne({ username });
  if (!receiver) {
    return res.status(404).json({ status: "fail", message: "User not found" });
  }

  const receiverId = receiver._id.toString();

  if (receiverId === senderId) {
    return res
      .status(400)
      .json({ status: "fail", message: "You cannot invite yourself" });
  }

  const role = await Role.findOne({ _id: roleId, project: projectId });
  if (!role) {
    return res.status(404).json({
      status: "fail",
      message: "Role not found or does not belong to this project",
    });
  }

  const project = await Project.findById(projectId)
    .populate({ path: "members.user", select: "_id name username" })
    .populate("members.role");

  if (!project) {
    return res
      .status(404)
      .json({ status: "fail", message: "Project not found" });
  }

  const isAlreadyMember = project.members.some(
    (member) => member.user.toString() === receiverId
  );
  if (isAlreadyMember) {
    return res
      .status(400)
      .json({ status: "fail", message: "User is already a member" });
  }

  const existingInvite = await Invite.findOne({
    project: projectId,
    receiver: receiverId,
  });
  if (existingInvite) {
    return res
      .status(400)
      .json({ status: "fail", message: "Invite already sent" });
  }

  const newInvite = await Invite.create({
    project: projectId,
    sender: senderId,
    receiver: receiverId,
    role: roleId,
    status: "pending",
  });

  res
    .status(201)
    .json({ status: "success", message: "Invite sent", data: newInvite });
});

module.exports = {
  sendInvite,
};
