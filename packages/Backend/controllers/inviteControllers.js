import Invite from "../models/inviteModel.js";
import Project from "../models/projectsModel.js";
import User from "../models/userModel.js";
import Role from "../models/roleModel.js";
import * as HF from "./handlerFactory.js";
import { catchAsync } from "../utils/catchAsync.js";

/**
 * Send an invite to a user to join a project.
 * Only users with the "invite" permission can send invites.
 */
const searchUsersForInvite = catchAsync(async (req, res, next) => {
  const { username } = req.query; // Get the username from the query parameter

  // Find users whose username matches (case-insensitive search)
  const users = await User.find({
    username: { $regex: new RegExp(username, "i") }, // Case-insensitive search
  }).select("username name"); // Only return necessary fields

  if (users.length === 0) {
    return res.status(404).json({ status: "fail", message: "No users found" });
  }

  res.status(200).json({ status: "success", data: users });
});

const sendInvite = catchAsync(async (req, res, next) => {
  try {
    const { projectId, username, roleId } = req.body;
    const senderId = req.user.id; // Logged-in user

    // Find the receiver by username
    const receiver = await User.findOne({ username });
    if (!receiver) {
      return res
        .status(404)
        .json({ status: "fail", message: "User not found" });
    }

    const receiverId = receiver._id.toString();

    // Prevent self-invitation
    if (receiverId === senderId) {
      return res
        .status(400)
        .json({ status: "fail", message: "You cannot invite yourself" });
    }

    // Check if the role exists and belongs to the project
    const role = await Role.findOne({ _id: roleId, project: projectId });
    if (!role) {
      return res.status(404).json({
        status: "fail",
        message: "Role not found or does not belong to this project",
      });
    }

    // Check if the project exists
    const project = await Project.findById(projectId).populate("members.role");
    if (!project) {
      return res
        .status(404)
        .json({ status: "fail", message: "Project not found" });
    }

    // Check if the sender is a member and has permission to invite
    const senderMember = project.members.find(
      (member) => member.user.toString() === senderId
    );
    if (!senderMember) {
      return res
        .status(403)
        .json({ status: "fail", message: "You are not a project member" });
    }

    // Verify if the sender has the "invite" permission
    const senderRole = await Role.findById(senderMember.role);
    if (!senderRole || !senderRole.permissions.includes("invite")) {
      return res.status(403).json({
        status: "fail",
        message: "You do not have permission to invite users",
      });
    }

    // Ensure the user is not already a member
    const isAlreadyMember = project.members.some(
      (member) => member.user.toString() === receiverId
    );
    if (isAlreadyMember) {
      return res
        .status(400)
        .json({ status: "fail", message: "User is already a member" });
    }

    // Prevent duplicate invitations
    const existingInvite = await Invite.findOne({
      project: projectId,
      receiver: receiverId,
    });
    if (existingInvite) {
      return res
        .status(400)
        .json({ status: "fail", message: "Invite already sent" });
    }

    // Create and save the invite
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
  } catch (error) {
    next(error);
  }
});

/**
 * Accept or decline an invite.
 */
const acceptOrDeclineInvite = catchAsync(async (req, res, next) => {
  const { inviteId, status } = req.body;
  const receiverId = req.user.id;

  // Validate status
  if (!["accepted", "declined"].includes(status)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid status. Use 'accepted' or 'declined'.",
    });
  }

  // Find the invite
  const invite = await Invite.findOne({
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

  // If the invite was declined, delete it and return success
  if (status === "declined") {
    await Invite.findByIdAndDelete(inviteId);
    return res
      .status(200)
      .json({ status: "success", message: "Invite declined and deleted" });
  }

  // Ensure the project exists
  const project = await Project.findById(invite.project);
  if (!project) {
    return res
      .status(404)
      .json({ status: "fail", message: "Project not found" });
  }

  // Ensure the invite has not expired (e.g., 7 days old)
  const inviteAge = Date.now() - new Date(invite.createdAt).getTime();
  const sevenDays = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
  if (inviteAge > sevenDays) {
    return res
      .status(400)
      .json({ status: "fail", message: "This invite has expired" });
  }

  // Validate the role before adding the user
  const role = await Role.findById(invite.role);
  if (!role) {
    return res
      .status(400)
      .json({ status: "fail", message: "Assigned role no longer exists" });
  }

  // Check if the user is already a member
  const isAlreadyMember = project.members.some(
    (member) => member.user.toString() === receiverId
  );
  if (isAlreadyMember) {
    return res.status(400).json({
      status: "fail",
      message: "User is already a member of this project",
    });
  }

  // Add the user to the project members list with the assigned role
  project.members.push({ user: receiverId, role: invite.role });
  await project.save();

  // Delete the invite since it's accepted
  await Invite.findByIdAndDelete(inviteId);

  // Return updated project data with the new member
  const updatedProject = await Project.findById(invite.project).populate(
    "members.role"
  );

  return res.status(200).json({
    status: "success",
    message: "Invite accepted and user added to the project",
    data: updatedProject,
  });
});

/**
 * Fetch all invites, populating related fields.
 */
const getAllInvites = HF.getAll(Invite);

/**
 * Fetch a single invite, populating related fields.
 */
const getOneInvite = HF.getOne(Invite);

/**
 * Delete an invite.
 */
const deleteInvite = HF.deleteOne(Invite);

export {
  sendInvite,
  acceptOrDeclineInvite,
  getAllInvites,
  getOneInvite,
  deleteInvite,
  searchUsersForInvite,
};
