// import Project from "../models/projectsModel";
// import Role from "../models/roleModel";

// export const checkProjectPermission = async (
//   userId,
//   projectId,
//   requiredPermission
// ) => {
//   try {
//     const project = await Project.findById(projectId).populate("members.role");
//     if (!project) return false;

//     // Find the user's membership in the project
//     const member = project.members.find((m) => m.user.toString() === userId);
//     if (!member) return false; // User is not part of the project

//     // Get the user's role and permissions
//     const userRole = await Role.findById(member.role);
//     if (!userRole) return false;

//     return userRole.permissions.includes(requiredPermission);
//   } catch (error) {
//     console.error("Permission check error:", error);
//     return false;
//   }
// };
