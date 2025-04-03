import Sidebar from "../../shared/Sidebar";
import React from "react";
import {
  Bell,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Clock,
  MoreHorizontal,
  Image,
  Mail,
} from "lucide-react";
import {
  Button,
  Box,
  IconButton,
  Typography,
  Badge,
  MenuItem,
  Menu,
  Avatar,
  Tooltip,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../hooks/useAuth";
import { useAuthStore } from "../../stores/authStore";

export default function TaskordDashboard() {
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const { user } = useAuthStore();
  const { signOut, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      toast.error(`Logout failed: ${error.message}`);
    }
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const hostGoogleImage = (url) => {
    return `https://images.weserv.nl/?url=${encodeURIComponent(
      url
    )}&w=200&h=200`;
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };
  return (
    <>
      <div className="flex min-h-screen bg-[#FAFAFA] !h-full">
        <Sidebar  className= "hidden" />
        {/* Main Content */}
        <div className=" sm:ml-[16rem] h-full p-8 overflow-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl">Hi, {user.username}</h1>
              <p className="text-gray-600">Let's finish your task today!</p>
            </div>
            <div className="flex items-center gap-4 ">
              <IconButton
                size="large"
                aria-label="show 4 new mails"
                color="inherit"
                className="!bg-[#F5F5F7]"
              >
                <Badge cla badgeContent={1} color="error">
                  <Mail className="text-[#8E92BC]" />
                </Badge>
              </IconButton>
              <IconButton
                sx={{
                  border: 1,
                  borderColor: "red",
                }}
                className="relative w-12 h-12 !border !border-[#F5F5F7] !rounded-full !aspect-square"
              >
                <Badge cla badgeContent={1} color="error">
                  <Bell className="text-[#8E92BC]" />
                </Badge>
              </IconButton>
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <Tooltip title="Open settings">
                  <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                    <Avatar
                      className="!w-12 !h-auto"
                      src={hostGoogleImage(user.image)}
                    />
                  </IconButton>
                </Tooltip>
                <Menu
                  sx={{ mt: "53px" }}
                  id="menu-appbar"
                  anchorEl={anchorElUser}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={Boolean(anchorElUser)}
                  onClose={handleCloseUserMenu}
                >
                  <MenuItem
                    key="logout"
                    onClick={handleLogout}
                    disabled={isLoading}
                  >
                    <Typography sx={{ textAlign: "center" }}>Logout</Typography>
                  </MenuItem>
                </Menu>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1  md:grid-cols-[220px_repeat(3,_minmax(233px,_1fr))] gap-6 mb-8">
            {/* Running Task - Updated for responsiveness */}
            <div className="w-[233px] relative flex flex-col gap-4 bg-[#111827] text-white p-6 rounded-xl">
              <div>
                <h2 className="text-lg">Running Task</h2>
              </div>
              <div className="text-4xl font-simi mb-4">65</div>
              <div className="flex items-center justify-between md:justify-start md:absolute md:bottom-6">
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl">
                        <span className="font-light">45%</span>
                      </div>
                    </div>
                  </div>
                  <CircularProgress
                    variant="determinate"
                    value={100}
                    size={90}
                    thickness={2}
                    sx={{ color: "#1F2937", position: "absolute" }}
                    className="absolute bottom-0"
                  />
                  <CircularProgress
                    variant="determinate"
                    value={45}
                    size={90}
                    thickness={2}
                    className="absolute bottom-0"
                    sx={{
                      color: "#4F46E5",
                      background: "transparent",
                      "& .MuiCircularProgress-circle": {
                        strokeLinecap: "round",
                      },
                    }}
                  />
                </div>
                <div className="text-center md:ml-2">
                  <div className="text-2xl font-normal">100</div>
                  <div className="text-gray-400">Task</div>
                </div>
              </div>
            </div>

            {/* Activity */}
            <div className=" lg:col-span-3 bg-white p-6 rounded-xl border border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-medium">Activity</h2>
                <div className="flex items-center gap-2 text-sm bg-gray-50 px-3 py-1 rounded-md">
                  <span>This Week</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
              <div className="relative h-40">
                {/* Activity Chart */}
                <div className="absolute top-1/4 left-1/4 bg-blue-500 w-3 h-3 rounded-full z-10"></div>
                <div className="absolute top-1/4 left-1/4 bg-blue-100 w-5 h-5 rounded-full"></div>
                <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-full bg-gray-900 text-white px-2 py-1 rounded text-xs">
                  2 Task
                </div>
                
                <svg
                  className="w-full h-full"
                  viewBox="0 0 300 100"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,50 C20,30 40,70 60,30 C80,10 100,50 120,60 C140,70 160,40 180,50 C200,60 220,50 240,55 C260,60 280,55 300,55"
                    fill="none"
                    stroke="#e5e7eb"
                    strokeWidth="1"
                  />
                  <path
                    d="M0,50 C20,30 40,70 60,30 C80,10 100,50 120,60 C140,70 160,40 180,50 C200,60 220,50 240,55 C260,60 280,55 300,55"
                    fill="none"
                    stroke="#111827"
                    strokeWidth="2"
                  />
                </svg>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <div>S</div>
                  <div>M</div>
                  <div>T</div>
                  <div>W</div>
                  <div>T</div>
                  <div>F</div>
                  <div>S</div>
                </div>
                <div className="absolute left-0 top-0 grid grid-rows-3 h-full text-xs text-gray-500">
                  <div>3</div>
                  <div>2</div>
                  <div>1</div>
                </div>
              </div>
            </div>
          </div>

          {/* Upcoming Task */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Upcoming Task</h2>
              <div className="flex gap-2">
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Task 1 */}
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Mobile App Design"
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-semibold mb-1">
                  Creating Mobile App Design
                </h3>
                <p className="text-sm text-gray-500 mb-4">UI/UX Design</p>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="text-blue-500">75%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: "75%" }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">3 Days Left</span>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
                      >
                        <Image
                          src={`/placeholder.svg?height=24&width=24&text=${i}`}
                          alt="Team member"
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Task 2 */}
              <div className="bg-white p-5 rounded-xl border border-gray-200">
                <div className="mb-4">
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Website Design"
                    width={400}
                    height={200}
                    className="w-full h-40 object-cover rounded-lg"
                  />
                </div>
                <h3 className="font-semibold mb-1">Creating Perfect Website</h3>
                <p className="text-sm text-gray-500 mb-4">Web Developer</p>

                <div className="mb-2">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="text-blue-500">85%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: "85%" }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">4 Days Left</span>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
                      >
                        <Image
                          src={`/placeholder.svg?height=24&width=24&text=${i}`}
                          alt="Team member"
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="hidden lg:block border-l border-gray-200 bg-white p-5 overflow-auto">
          {/* Calendar */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <ChevronLeft className="w-4 h-4" />
              </button>
              <h2 className="text-lg font-medium">July 2024</h2>
              <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center mb-2">
              <div className="text-sm font-medium">S</div>
              <div className="text-sm font-medium">M</div>
              <div className="text-sm font-medium">T</div>
              <div className="text-sm font-medium">W</div>
              <div className="text-sm font-medium">T</div>
              <div className="text-sm font-medium">F</div>
              <div className="text-sm font-medium">S</div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center">
              {[10, 11, 12, 13, 14, 15, 16].map((day, i) => {
                const isToday = day === 14;
                return (
                  <div
                    key={i}
                    className={`w-8 h-8 mx-auto flex items-center justify-center rounded-full ${
                      isToday ? "bg-blue-600 text-white" : "hover:bg-gray-100"
                    }`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Task Today */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Task Today</h2>
              <button>
                <MoreHorizontal className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="mb-3">
                <Image
                  src="/placeholder.svg?height=200&width=320"
                  alt="Mobile Apps"
                  width={320}
                  height={200}
                  className="w-full h-40 object-cover"
                />
              </div>
              <div className="px-4 pb-4">
                <h3 className="font-semibold text-lg mb-1">
                  Creating Awesome Mobile Apps
                </h3>
                <p className="text-sm text-gray-500 mb-3">UI/UX Designer</p>

                <div className="mb-3">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progress</span>
                    <span className="text-blue-500">90%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full"
                      style={{ width: "90%" }}
                    ></div>
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">1 Hour</span>
                  </div>
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div
                        key={i}
                        className="w-6 h-6 rounded-full border-2 border-white overflow-hidden"
                      >
                        <Image
                          src={`/placeholder.svg?height=24&width=24&text=${i}`}
                          alt="Team member"
                          width={24}
                          height={24}
                          className="object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Detail Task */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium">Detail Task</h2>
              <span className="text-sm text-gray-500">UI/UX Designer</span>
            </div>

            <div className="space-y-4 mb-6">
              <div className="flex gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300">
                  1
                </div>
                <div className="text-sm">Understanding the tools in Figma</div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300">
                  2
                </div>
                <div className="text-sm">
                  Understand the basics of making designs
                </div>
              </div>
              <div className="flex gap-3">
                <div className="w-6 h-6 flex items-center justify-center rounded-full border border-gray-300">
                  3
                </div>
                <div className="text-sm">
                  Design a mobile application with figma
                </div>
              </div>
            </div>

            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
              Go To Detail
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
