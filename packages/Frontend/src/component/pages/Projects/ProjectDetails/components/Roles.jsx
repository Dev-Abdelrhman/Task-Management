import { Button, Avatar, IconButton } from "@mui/material";
import { Search, Pencil, X, ReceiptText, X as CloseIcon } from "lucide-react";
import { useState } from "react";

const hostGoogleImage = (url) => {
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=200&h=200`;
};

const Roles = ({
  userId,
  projectId,
  project,
  setDeleteModalOpen,
  setEditingRoleId,
  setIsEditing,
  setRoleToDelete,
  setOpenModal,
  setNewRole,
  setDetailsModalOpen,
  setShowPermissionWarning,
  setPendingPermissionChange,
  handleRoleDetails,
  rolesData,
  onCloseMobile,
}) => {
  const [searchMemberQuery, setSearchMemberQuery] = useState("");

  const filteredMembers = project.members.filter((mem) => {
    const userName = mem.user?.name?.toLowerCase() || "";
    const userUsername = mem.user?.username?.toLowerCase() || "";
    const lowerSearchQuery = searchMemberQuery.toLowerCase();
    return (
      userName.includes(lowerSearchQuery) ||
      userUsername.includes(lowerSearchQuery)
    );
  });

  if (!userId || !projectId) {
    return null;
  }

  return (
    <div
      className="
      hidden 2xl:flex dark:bg-[#080808] fixed right-0 top-0 dark:border-0 h-full w-[420px] border-l border-gray-200 bg-[#F5F5F7] p-5 flex-col gap-4 overflow-y-auto
      lg:flex lg:w-[420px] lg:fixed lg:right-0 lg:top-0 lg:border-l lg:border-gray-200 lg:dark:bg-[#080808] lg:bg-[#F5F5F7] lg:p-5
    "
    >
      <div className="bg-white w-[370px] rounded-xl dark:bg-[#1a1a1a] mt-[70px] h-full p-5 flex-col gap-4 overflow-y-auto bottom-0">
        <div className="flex justify-between items-center mb-4 gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-3 flex items-center">
              <Search className="h-5 w-5 text-[#8E92BC]" />
            </span>
            <input
              type="search"
              className="dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-300 w-full pl-10 pr-4 py-2 border border-gray-200 !rounded-[10px] focus:outline-none"
              placeholder="Search Members"
              value={searchMemberQuery}
              onChange={(e) => setSearchMemberQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setOpenModal(true)}
            className="!text-base !py-2 !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-medium !text-white !w-[100px] !rounded-xl"
          >
            Add Role
          </Button>
        </div>

        <div className="flex gap-1 flex-wrap">
          {rolesData?.doc?.map((role) => (
            <div
              key={role._id}
              className="flex gap-2 px-2 py-2 hover:!border-[#546FFF] !items-center justify-between text-sm rounded-xl text-center !border-2 !border-gray-500"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: role.color }}
                ></div>
                <p className="text-gray-800 dark:text-white">{role.name}</p>
              </div>
              <div className="flex items-center gap-1">
                <Pencil
                  className="w-3 h-3 cursor-pointer dark:text-gray-400"
                  onClick={(e) => {
                    e.stopPropagation();
                    setNewRole({
                      name: role.name,
                      color: role.color,
                      permissions: role.permissions,
                    });
                    setEditingRoleId(role._id);
                    setIsEditing(true);
                    setOpenModal(true);
                  }}
                />
                <X
                  className="w-4 h-4 cursor-pointer dark:text-gray-400"
                  onClick={() => {
                    setRoleToDelete(role._id);
                    setDeleteModalOpen(true);
                  }}
                />
                <ReceiptText
                  className="w-4 h-4 cursor-pointer dark:text-gray-400"
                  onClick={() => handleRoleDetails(role._id)}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5 font-semibold text-2xl">
          <h2 className="mb-4 dark:text-gray-300">
            Members - {project.memberCount}
          </h2>
          <div className="flex-col gap-3">
            {filteredMembers.map((mem) => (
              <div
                key={mem.id}
                className="flex gap-2 mb-2 dark:bg-[#2a2a2a] dark:hover:bg-[#3a3a3a] select-none dark:text-white items-center bg-gray-100 !rounded-xl !capitalize px-2 py-2 transition-all duration-300 hover:bg-gray-300 hover:translate-x-2"
              >
                <Avatar
                  className="!w-10 !h-10"
                  src={
                    mem.user.image.length
                      ? hostGoogleImage(mem.user.image[0].url)
                      : undefined
                  }
                />
                <span key={mem.id} className="font-normal text-lg">
                  {mem.user.name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Roles;
