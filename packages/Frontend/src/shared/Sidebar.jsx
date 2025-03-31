import { Link, NavLink } from "react-router-dom";
import {
  Home,
  Folder,
  ListChecks,
  Settings,
  MessageSquareMore,
} from "lucide-react";
import logo from "../assets/logo.png";
function Sidebar() {
  return (
    <div className="w-64 min-h-screen bg-[#FFFFFF] border-r border-gray-200 pl-6 pt-4 fixed">
      {/* Logo Section */}
      <div className="flex items-center gap-3 pt-4 mb-8">
        <img src={logo} alt="Logo" className="h-9 w-auto" />
        <h1 className="text-3xl font-medium !text-[##53577A]-800">Taskord</h1>
      </div>

      {/* Navigation Links */}
      <nav className="h-full flex flex-col gap-4">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center pl-[20px] p-[10px] rounded-lg transition-colors  ${
              isActive
                ? "hover:bg-gray-100 hover:text-[#141522] rounded-xl"
                : "text-[#8E92BC] hover:bg-gray-100 hover:text-[#141522] rounded-xl"
            }`
          }
        >
          <Home className="h-5 w-5 mr-3" />
          <span className="text-lg">Overview</span>
        </NavLink>

        <NavLink
          to="/projects"
          className={({ isActive }) =>
            `flex items-center pl-[20px] p-[10px] rounded-lg transition-colors  ${
              isActive
                ? "hover:bg-gray-100 hover:text-[#141522] rounded-xl"
                : "text-[#8E92BC] hover:bg-gray-100 hover:text-[#141522] rounded-xl"
            }`
          }
        >
          <Folder className="h-5 w-5 mr-3" />
          <span className="text-lg">Projects</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center pl-[20px] p-[10px] rounded-lg transition-colors  ${
              isActive
                ? "hover:bg-gray-100 hover:text-[#141522] rounded-xl"
                : "text-[#8E92BC] hover:bg-gray-100 hover:text-[#141522] rounded-xl"
            }`
          }
        >
          <ListChecks className="h-5 w-5 mr-3" />
          <span className="text-lg">All Tasks</span>
        </NavLink>

        <NavLink
          to="/tasks"
          className={({ isActive }) =>
            `flex items-center pl-[20px] p-[10px] rounded-lg transition-colors  ${
              isActive
                ? "hover:bg-gray-100 hover:text-[#141522] rounded-xl"
                : "text-[#8E92BC] hover:bg-gray-100 hover:text-[#141522] rounded-xl"
            }`
          }
        >
          <MessageSquareMore className="h-5 w-5 mr-3" />
          <span className="text-lg">Message</span>
        </NavLink>

        <NavLink
          to="/settings"
          className={({ isActive }) =>
            `flex items-center pl-[20px] p-[10px] rounded-lg transition-colors  ${
              isActive
                ? "hover:bg-gray-100 hover:text-[#141522] rounded-xl"
                : "text-[#8E92BC] hover:bg-gray-100 hover:text-[#141522] rounded-xl"
            }`
          }
        >
          <Settings className="h-5 w-5 mr-3" />
          <span className="text-lg">Settings</span>
        </NavLink>
      </nav>
    </div>
  );
}

export default Sidebar;
