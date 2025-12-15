const Project = require("../../models/project.Model.js");
const catchAsync = require("../../utils/catchAsync.js");

const getProjectMembers = catchAsync(async (req, res, next) => {
  const project = await Project.findById(req.params.id)
    .populate("members.user")
    .populate({ path: "members.role", select: "-__v -_id -permissions" });

  if (!project) {
    return res.status(404).json({
      status: "fail",
      message: "Project not found",
    });
  }
  const members = project.members.map((member) => ({
    user: member.user,
    role: member.role,
  }));

  res.status(200).json({
    status: "success",
    data: members,
  });
  next();
});
module.exports = {
  getProjectMembers,
};
