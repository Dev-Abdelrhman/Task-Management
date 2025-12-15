const Invite = require("../../models/invite.Model.js");
const Project = require("../../models/project.Model.js");
const catchAsync = require("../../utils/catchAsync.js");

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

module.exports = {
  acceptInvite,
  declineInvite,
};
