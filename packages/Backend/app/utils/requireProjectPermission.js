const Project = require("../models/project.Model.js");
const catchAsync = require("./catchAsync.js");
const AppError = require("./appError.js");

// Merged function for checking permissions for projects only
const requireProjectPermission = (permissions) =>
  catchAsync(async (req, res, next) => {
    const userId = req.user.id;
    let projectId = req.params.projectId || req.params.id;

    // If no projectId found, skip permission check
    if (!projectId) {
      return next(); // Skip permission check if no projectId
    }

    // Ensure permissions is always an array
    if (!Array.isArray(permissions)) {
      permissions = [permissions];
    }

    // Check if user has the required permissions in the project
    const project = await Project.findById(projectId).populate("members.role");
    if (!project) {
      return next(); // If no project, skip permission check
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
