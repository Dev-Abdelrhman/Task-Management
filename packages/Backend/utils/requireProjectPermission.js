const Project = require("../models/project.Model.js");
const catchAsync = require("./catchAsync.js");
const AppError = require("./appError");

const checkProjectPermission = async (
  userId,
  projectId,
  requiredPermission
) => {
  const project = await Project.findById(projectId).populate("members.role");
  if (!project) {
    return false;
  }

  const member = project.members.find(
    (m) => m.user._id.toString() === userId.toString()
  );

  if (!member) {
    return false;
  }

  if (!member.role) {
    return false;
  }

  return Array.isArray(member.role.permissions)
    ? member.role.permissions.includes(requiredPermission)
    : false;
};

const requireProjectPermission = (permissions) =>
  catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    const projectId = req.params.id;

    if (!projectId) {
      return next();
    }

    if (!Array.isArray(permissions)) {
      permissions = [permissions];
    }

    const permissionChecks = permissions.map((permission) =>
      checkProjectPermission(userId, projectId, permission)
    );

    const results = await Promise.all(permissionChecks);

    const hasPermission = results.some((result) => result === true);

    if (!hasPermission) {
      return next(
        new AppError("You do not have permission to perform this action", 403)
      );
    }

    next();
  });

module.exports = requireProjectPermission;
