import { Link, NavLink } from "react-router-dom";
import {
  Home,
  Folder,
  ListChecks,
  Settings,
  MessageSquareMore,
  User,
} from "lucide-react";
import logo from "../assets/logo.png";
import { Button } from "@mui/material";
import HelpRoundedIcon from "@mui/icons-material/HelpOutlined";

function Sidebar() {
  return (
    <div className="w-64 fixed h-full bg-[#FFFFFF] border-r border-gray-200 pt-4 hidden md:block ">
      {/* Logo Section */}
      <div className="flex items-center justify-center gap-2 pt-4 mb-8">
        <img src={logo} alt="Logo" className="h-9 w-auto" />
        <h1 className="text-4xl">Taskord</h1>
      </div>

      {/* Navigation Links */}
      <nav className="h-full !flex justify-center gap-4 mx-4">
        <div className="flex !flex-col gap-5">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center px-[20px] p-[10px] !pr-11  rounded-lg transition-colors  ${
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
        </div>
        <div className="left-8 absolute bottom-8">
          <div className="bg-[#141522] text-white p-6 rounded-xl !w-52 flex-col text-center relative !right-2">
            <div className="flex justify-end absolute top-[-20px] right-[40%] shadow-sm shadow-white !rounded-full">
              <div className="w-10 h-10 bg-white flex items-center justify-center !rounded-full">
                <HelpRoundedIcon
                  fontSize="large"
                  className=" text-[#141522] !rounded-full"
                />
              </div>
            </div>
            <h2 className="text-xl font-medium mt-8 mb-2 text-center">
              Help Center
            </h2>
            <p className="text-xs text-white mb-10">
              Having Trouble in Learning. Please contact us for more questions.
            </p>
            <Button className=" !capitalize !py-3 !px-4  !w-full !shadow-sm !shadow-white !bg-white !text-gray-900 !rounded-xl">
              Go To Help Center
            </Button>
          </div>
        </div>
      </nav>
    </div>
  );
}

export default Sidebar;
