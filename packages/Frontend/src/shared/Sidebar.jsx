import { Link, NavLink } from "react-router-dom";
import {
  Home,
  Folder,
  ListChecks,
  Settings,
  MessageSquareMore,
} from "lucide-react";
import logo from "../assets/logo.png";
import { Button } from "@mui/material";
import HelpRoundedIcon from "@mui/icons-material/HelpOutlined";
import { useState } from "react";
import { Menu, X } from "lucide-react";

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden fixed top-4 right-3 z-50">
        <button
          onClick={toggleSidebar}
          className="bg-gray-800 text-white p-2 rounded-lg shadow-md hover:bg-gray-700 transition-colors"
          aria-label={isOpen ? "Close menu" : "Open menu"}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-[#252525] pt-4 transition-transform duration-300 z-40
          ${isOpen ? "translate-x-0 shadow-lg" : "-translate-x-full"} md:translate-x-0 md:static md:block`}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center gap-2 pt-4 mb-8 px-4">
          <img src={logo} alt="Logo" className="h-9 w-auto select-none" />
          <h1 className="text-3xl sm:text-4xl font-bold select-none">Taskord</h1>
        </div>

        {/* Navigation Links */}
        <nav className="flex flex-col h-full mx-4 gap-4">
          <div className="flex flex-col gap-3">
            {[
              { to: "/home", icon: Home, label: "Overview" },
              { to: "/projects", icon: Folder, label: "Projects" },
              { to: "/user-tasks", icon: ListChecks, label: "All Tasks" },
              { to: "/invites", icon: ListChecks, label: "Invites" },
              { to: "/tasks", icon: MessageSquareMore, label: "Message" },
              { to: "/settings", icon: Settings, label: "Settings" },
            ].map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/home"}
                className={({ isActive }) =>
                  `flex items-center px-4 py-2 rounded-xl transition-colors ${
                    isActive
                      ? "bg-gray-100 text-[#141522] font-medium"
                      : "text-[#8E92BC] hover:bg-gray-100 hover:text-[#141522]"
                  }`
                }
                onClick={() => setIsOpen(false)} // Close sidebar on link click (mobile)
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="text-base sm:text-lg">{item.label}</span>
              </NavLink>
            ))}
          </div>

          {/* Help Center */}
          <div className="mt-auto mb-8 px-4">
            <div className="bg-[#141522] text-white p-6 rounded-xl flex flex-col text-center relative">
              <div className="flex justify-end absolute top-[-20px] right-[40%] shadow-sm shadow-white rounded-full">
                <div className="w-10 h-10 bg-white flex items-center justify-center rounded-full">
                  <HelpRoundedIcon
                    fontSize="large"
                    className="text-[#141522] rounded-full"
                  />
                </div>
              </div>
              <h2 className="text-lg sm:text-xl font-medium mt-8 mb-2">
                Help Center
              </h2>
              <p className="text-xs sm:text-sm text-white mb-6">
                Having trouble? Contact us for more information.
              </p>
              <Button
                className="!capitalize !py-2 !px-4 !w-full !shadow-sm !shadow-white !bg-white !text-gray-900 !rounded-xl !text-sm"
                sx={{ textTransform: "none" }}
              >
                Go To Help Center
              </Button>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
}

export default Sidebar;