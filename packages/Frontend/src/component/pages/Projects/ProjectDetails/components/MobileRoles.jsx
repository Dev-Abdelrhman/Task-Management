import { Button, Avatar, IconButton } from "@mui/material";
import { Search, Pencil, X, ReceiptText, X as CloseIcon } from "lucide-react";
import { useState } from "react";

const hostGoogleImage = (url) => {
  return `https://images.weserv.nl/?url=${encodeURIComponent(url)}&w=200&h=200`;
};

const MobileRoles = ({
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
      lg:hidden
      dark:bg-[#080808] 
      h-full 
      w-full sm:w-[400px]
      border-l border-gray-200 
      bg-white
      p-4
      flex-col gap-4 overflow-y-auto
      shadow-lg
    "
    >
      {/* Mobile close button */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold dark:text-white">
          Roles & Members
        </h2>
        <IconButton onClick={onCloseMobile} className="!p-2">
          <CloseIcon className="w-6 h-6 dark:text-white" />
        </IconButton>
      </div>

      <div className="bg-white dark:bg-[#1a1a1a] h-full p-4 flex-col gap-4 overflow-y-auto">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-3">
          <div className="relative w-full sm:w-auto sm:flex-1">
            <span className="absolute inset-y-0 left-3 flex items-center">
              <Search className="h-5 w-5 text-[#8E92BC]" />
            </span>
            <input
              type="search"
              className="dark:bg-[#2D2D2D] dark:border-gray-500 dark:text-gray-300 w-full pl-10 pr-4 py-2 border border-gray-200 !rounded-[10px] focus:outline-none text-sm sm:text-base"
              placeholder="Search Members"
              value={searchMemberQuery}
              onChange={(e) => setSearchMemberQuery(e.target.value)}
            />
          </div>
          <Button
            onClick={() => setOpenModal(true)}
            className="!text-sm sm:!text-base !py-2 !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-medium !text-white !w-full sm:!w-[100px] !rounded-xl mt-2 sm:mt-0"
          >
            Add Role
          </Button>
        </div>

        <div className="flex gap-1 flex-wrap mb-6">
          {rolesData?.doc?.map((role) => (
            <div
              key={role._id}
              className="flex gap-2 px-2 py-2 hover:!border-[#546FFF] !items-center justify-between text-sm rounded-xl text-center !border-2 !border-gray-500 cursor-pointer w-full sm:w-auto"
            >
              <div className="flex items-center gap-2 flex-1">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: role.color }}
                ></div>
                <p className="text-gray-800 dark:text-white cursor-pointer truncate">
                  {role.name}
                </p>
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

        <div className="mt-5">
          <h2 className="mb-4 dark:text-gray-300 text-xl sm:text-2xl font-semibold">
            Members - {project.memberCount}
          </h2>
          <div className="flex-col gap-3 max-h-[300px] overflow-y-auto">
            {filteredMembers.map((mem) => (
              <div
                key={mem.id}
                className="flex gap-2 mb-2 dark:bg-[#2a2a2a] dark:hover:bg-[#3a3a3a] select-none dark:text-white items-center bg-gray-100 !rounded-xl !capitalize px-2 py-2 transition-all duration-300 hover:bg-gray-300"
              >
                <Avatar
                  className="!w-8 !h-8 sm:!w-10 sm:!h-10"
                  src={
                    mem.user.image.length
                      ? hostGoogleImage(mem.user.image[0].url)
                      : undefined
                  }
                />
                <span
                  key={mem.id}
                  className="font-normal text-sm sm:text-lg truncate"
                >
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

export default MobileRoles;
