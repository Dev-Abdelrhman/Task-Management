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

  await Project.findByIdAndUpdate(
    projectId,
    {
      $pull: { members: { user: memberId } },
    },
    { new: true }
  );

  res.status(200).json({
    status: "success",
    message: "Member kicked from the project successfully",
  });
});

module.exports = {
  kickProjectMember,
};
