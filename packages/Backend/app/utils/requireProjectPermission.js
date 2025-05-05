const Project = require("../models/project.Model.js");
const catchAsync = require("./catchAsync.js");
const AppError = require("./appError.js");

const requireProjectPermission = (permissions) =>
  catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    let projectId = req.params.projectId || req.params.id;

    if (!projectId) {
      return next();
    }

    if (!Array.isArray(permissions)) {
      permissions = [permissions];
    }

    const project = await Project.findById(projectId).populate("members.role");
    if (!project) {
      return next();
    }

    const member = project.members.find(
      (m) => m.user._id.toString() === userId.toString()
    );

    if (!member || !member.role) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    const results = permissions.map(
      (permission) =>
        Array.isArray(member.role.permissions) &&
        member.role.permissions.includes(permission)
    );

    const hasPermission = results.some((result) => result === true);

    if (!hasPermission) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  });

module.exports = requireProjectPermission;
