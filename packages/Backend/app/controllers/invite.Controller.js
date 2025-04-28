const Invite = require("../models/invite.Model.js");
const Project = require("../models/project.Model.js");
const User = require("../models/user.Model.js");
const Role = require("../models/role.Model.js");
const FC = require("./Factory.Controller.js");
const catchAsync = require("../utils/catchAsync.js");

const searchUsersForInvite = catchAsync(async (req, res, next) => {
  const { username } = req.query;
  const currentUserId = req.user._id;

  const users = await User.find({
    username: { $regex: new RegExp(username, "i") },
    _id: { $ne: currentUserId },
  }).select("username name");

  if (users.length === 0) {
    return res.status(404).json({ status: "fail", message: "No users found" });
  }

  res.status(200).json({ status: "success", data: users });
});

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
    .populate({ path: "owner", select: "_id name username" })
    .populate("members.role");

  if (!project) {
    return res
      .status(404)
      .json({ status: "fail", message: "Project not found" });
  }

  if (!project.owner.name || project.owner.name.toString() !== senderName) {
    return res.status(403).json({
      status: "fail",
      message: "You are not the project owner",
    });
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

const declineInvite = catchAsync(async (req, res, next) => {
  const inviteId = req.params.id;
  const receiverId = req.user.id;

  const invite = await Invite.findOne({
    _id: inviteId,
    receiver: receiverId,
    status: "pending",
  });
  if (!invite) {
    return next(new AppError("Invite not found or already processed.", 404));
  }

  await Invite.findByIdAndDelete(inviteId);

  return res.status(200).json({
    status: "success",
    message: "Invite declined and deleted.",
  });
});
const acceptInvite = catchAsync(async (req, res, next) => {
  const inviteId = req.params.id;
  const receiverId = req.user.id;

  const invite = await Invite.findOne({
    _id: inviteId,
    receiver: receiverId,
    status: "pending",
  }).populate("project role");


  if (!invite) {
    return next(new AppError("Invite not found or already processed.", 404));
  }

  const inviteAge = Date.now() - new Date(invite.createdAt).getTime();
  const sevenDays = 7 * 24 * 60 * 60 * 1000;
  if (inviteAge > sevenDays) {
    return next(new AppError("This invite has expired", 400));
  }

  const updatedProject = await Project.findOneAndUpdate(
    { _id: invite.project },
    {
      $push: {
        members: {
          user: receiverId,
          role: invite.role,
        },
      },
    },
    { new: true }
  );

  await updatedProject.populate("members.role");

  invite.status = "accepted";
  await invite.save();

  return res.status(200).json({
    status: "success",
    message: "Invite accepted and user added to the project",
    data: updatedProject,
  });
});

const getAllInvitesForReceiver = FC.getAll(Invite, "receiver");
const getAllInvitesForSender = FC.getAll(Invite, "sender");

const getOneInvite = FC.getOne(Invite);
const updateInvite = FC.updateOne(Invite);
const deleteInvite = FC.deleteOne(Invite);

module.exports = {
  sendInvite,
  declineInvite,
  acceptInvite,
  getAllInvitesForSender,
  getAllInvitesForReceiver,
  getOneInvite,
  updateInvite,
  deleteInvite,
  searchUsersForInvite,
};
