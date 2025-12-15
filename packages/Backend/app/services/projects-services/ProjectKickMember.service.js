const Project = require("../../models/project.Model.js");
const catchAsync = require("../../utils/catchAsync.js");

const kickProjectMember = catchAsync(async (req, res, next) => {
  const projectId = req.params.id;
  const { memberId } = req.body;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({
      status: "fail",
      message: "Project not found",
    });
  }
  const memberIndex = project.members.findIndex(
    (member) => member.user.toString() === memberId
  );
  if (memberIndex === -1) {
    return res.status(404).json({
      status: "fail",
      message: "Member not found in the project",
    });
  }

  project.members.splice(memberIndex, 1);
  await project.save();
  res.status(200).json({
    status: "success",
    message: "Member kicked from the project successfully",
  });
  next();
});

module.exports = {
  kickProjectMember,
};
