export function getNavTitle(pathname) {
  if (pathname === "/projects") {
    return "Explore Project";
  }

  if (pathname.startsWith("/projects/ProjectDetails")) {
    return "Project Details";
  }

  if (pathname === "/settings") {
    return "Settings";
  }

  if (pathname === "/user-tasks") {
    return "Your Tasks";
  }

  if (pathname === "/invites") {
    return "Invites";
  }

  if (pathname.startsWith("/projects/users/") && pathname.endsWith("/tasks")) {
    return "User's Tasks";
  }

  return ""; // fallback
}
