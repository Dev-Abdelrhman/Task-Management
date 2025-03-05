import Invite from "../models/inviteModel.js";
import Project from "../models/projectsModel.js";
import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import * as HF from "./handlerFactory.js";
import { catchAsync } from "../utils/catchAsync.js";

const sendInvite = catchAsync(async (req, res, next) => {
  try {
    const { projectId, username, roleId } = req.body;
    const senderId = req.user.id; // Logged-in user

    // Find receiver by username
    const receiver = await User.findOne({ username });
    if (!receiver) {
      return res.status(404).json({
        status: "fail",
        message: "User not found with this username",
      });
    }

    const receiverId = receiver._id.toString();

    // Prevent sending invite to self
    if (receiverId === senderId) {
      return res.status(400).json({
        status: "fail",
        message: "You cannot invite yourself to a project",
      });
    }

    // Check if role exists
    const role = await Role.findById(roleId);
    if (!role) {
      return res
        .status(404)
        .json({ status: "fail", message: "Role not found" });
    }

    // Check if project exists and populate members
    const project = await Project.findById(projectId).populate("members");
    if (!project) {
      return res
        .status(404)
        .json({ status: "fail", message: "Project not found" });
    }

    // Ensure sender is part of the project (optional security check)
    const isSenderMember = project.members.some(
      (member) => member._id.toString() === senderId
    );
    if (!isSenderMember) {
      return res.status(403).json({
        status: "fail",
        message: "You are not authorized to send invites for this project",
      });
    }

    // Check if user is already a project member
    const isAlreadyMember = project.members.some(
      (member) => member._id.toString() === receiverId
    );
    if (isAlreadyMember) {
      return res.status(400).json({
        status: "fail",
        message: "User is already a member of this project",
      });
    }

    // Prevent duplicate invitations
    const existingInvite = await Invite.findOne({
      project: projectId,
      receiver: receiverId,
    });
    if (existingInvite) {
      return res.status(400).json({
        status: "fail",
        message: "An invite has already been sent to this user",
      });
    }

    // Create new invite
    const newInvite = await Invite.create({
      project: projectId,
      sender: senderId,
      receiver: receiverId,
      role: roleId,
      status: "pending",
    });

    res.status(201).json({
      status: "success",
      message: "Invite sent successfully",
      data: newInvite,
    });
  } catch (error) {
    next(error); // Forward error to global error handler
  }
});

const acceptOrDeclineInvite = catchAsync(async (req, res, next) => {
  const { inviteId, status } = req.body;
  const receiverId = req.user.id;

  // Validate status early
  if (!["accepted", "declined"].includes(status)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid status. Use 'accepted' or 'declined'.",
    });
  }

  // Fetch & delete invite in ONE query
  const invite = await Invite.findOneAndDelete({
    _id: inviteId,
    receiver: receiverId,
    status: "pending",
  });

  if (!invite) {
    return res.status(404).json({
      status: "fail",
      message: "Invite not found or already processed.",
    });
  }

  // If invite is declined, just return success response
  if (status === "declined") {
    return res.status(200).json({
      status: "success",
      message: "Invite declined and deleted",
    });
  }

  // Check if project exists
  const project = await Project.findById(invite.project);
  if (!project) {
    return res.status(404).json({
      status: "fail",
      message: "Project not found",
    });
  }

  // Add user to project members & save
  project.members.push({ user: receiverId, role: invite.role });
  await project.save();

  return res.status(200).json({
    status: "success",
    message: "Invite accepted successfully and deleted",
    data: project,
  });
});

const getAllInvites = HF.getAll(Invite, [
  "sender",
  "receiver",
  "project",
  "role",
]);

const getOneInvite = HF.getOne(Invite, [
  "sender",
  "receiver",
  "project",
  "role",
]);

const deleteInvite = HF.deleteOne(Invite);


export {
  sendInvite,
  acceptOrDeclineInvite,
  getAllInvites,
  getOneInvite,
  deleteInvite,
};
