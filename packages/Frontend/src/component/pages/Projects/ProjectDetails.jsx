import { Box, CircularProgress, Button, Chip, Avatar } from "@mui/material";
import {
  Clock,
  Users,
  Search,
  X,
  Pencil,
  ReceiptText,
  CircleCheck,
  Ban,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "../../../api/project";
import { useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { useRoles } from "../../../hooks/useRoles";
import { getRoles } from "../../../api/roles";
import InviteModal from "../Invite/InviteModal";
import { DateTime } from "luxon";

function ProjectDetails() {
  const { user } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { createRole, updateRole, getRoleById, deleteRole, isDeleting } =
    useRoles();
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isRoleDetailsLoading, setIsRoleDetailsLoading] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);

  const [editingRoleId, setEditingRoleId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newRole, setnewRole] = useState({
    name: "",
    permissions: [],
    color: "#546FFF",
  });
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);

  // Querys
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      return await getProjectById(projectId);
    },
  });
  console.log(data);

  const {
    data: rolesData,
    isLoading: rolesLoading,
    isError: rolesIsError,
  } = useQuery({
    queryKey: ["roles", projectId],
    queryFn: async () => {
      return await getRoles(user._id, projectId);
    },
  });
  const project = data?.doc;
  const projectMembers = data?.doc?.members;

  // Handles
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setnewRole((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRoleDetails = async (userId, projectId, roleId) => {
    setDetailsModalOpen(true); // Open modal immediately
    setSelectedRole(null); // Clear previous data
    setIsRoleDetailsLoading(true);

    try {
      const roleDetails = await getRoleById(userId, projectId, roleId);
      setSelectedRole(roleDetails);
    } catch (error) {
      console.error("Error fetching role details:", error);
    } finally {
      setIsRoleDetailsLoading(false);
    }
  };
  const handleClick = () => {
    navigate(`/projects/users/${user?._id}/projects/${projectId}/tasks`);
  };
  const hostGoogleImage = (url) => {
    return `https://images.weserv.nl/?url=${encodeURIComponent(
      url
    )}&w=200&h=200`;
  };

  const calculateDueDateStatus = (dueDateString, progress) => {
    if (progress === 100) {
      return (
        <>
          <CircleCheck className="w-5 h-5 text-green-500" />
          <span className="text-green-500">Completed</span>
        </>
      );
    }

    if (!dueDateString) return "No due date";

    const now = DateTime.local();
    const dueDate = DateTime.fromISO(dueDateString);

    if (dueDate < now) {
      return (
        <>
          <Ban className="w-5 h-5 text-red-500" />
          <span className="text-red-500">Overdue</span>
        </>
      );
    }

    const diff = dueDate.diff(now, ["days", "hours"]);

    if (diff.days < 1) {
      return (
        <>
          <Clock className="w-5 h-5 text-gray-500" />
          <span>{Math.ceil(diff.hours)} Hours Left</span>
        </>
      );
    }

    return (
      <>
        <Clock className="w-5 h-5 text-gray-500" />
        <span>{Math.ceil(diff.days)} Days Left</span>
      </>
    );
  };

  if (isLoading || rolesLoading) {
    return (
      <div className="flex fixed top-0 left-0 w-full h-full justify-center items-center">
        <CircularProgress />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="text-center text-red-500">Error: {error.message}</div>
    );
  }

  return (
    <>
      <div className="flex min-h-screen dark:bg-[#1E1E1E] bg-[#FAFAFA]">
        <div className="h-full w-[68%]">
          <Box
            component="img"
            src={
              project?.image?.[0]?.url ||
              "https://fakeimg.pl/1280x720?text=No+Image"
            }
            alt="check your img project"
            sx={{
              width: "100%",
              height: 550,
              objectFit: "cover",
              borderRadius: 5,
              my: 4,
              ml: 4,
            }}
          />
          <div>
            <div className="flex justify-between ml-16 ">
              <h1 className="font-medium text-4xl dark:text-[#e2e2e2] ">
                {project?.name}
              </h1>
              <Button
                onClick={() => handleClick()}
                className="!text-base !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-bold !text-white !h-14 !w-48 !rounded-xl"
              >
                Join Tasks
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4 ml-16">
              <p className="text-gray-500 dark:text-[#a0a0a0]">
                {project?.category} |
              </p>

              <p
                className="text-[#546FFF] cursor-pointer select-none"
                onClick={() => setInviteModalOpen(true)}
              >
                + Add Members
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2 mb-4 ml-16 text-black">
              <Users className="w-5 h-5 dark:text-[#a0a0a0]" />
              <p variant="body2" className="mr-5 dark:text-[#a0a0a0]">
                {data.doc.memberCount} Members Involved
              </p>
              <div className="flex items-center gap-2">
                {calculateDueDateStatus(project?.dueDate, project?.progress)}
              </div>
            </div>
            <div className=" ml-16 pt-4 ">
              <h1 className="font-medium text-4xl dark:text-[#e2e2e2]">
                Description
              </h1>
              <p className="text-gray-800 leading-8 text-xl my-4 dark:text-[#a0a0a0]">
                {" "}
                Follow the video tutorial above. Understand how to use each tool
                in the Figma application. Also learn how to make a good and
                correct design. Starting from spacing, typography, content, and
                many other design hierarchies. Then try to make it yourself with
                your imagination and inspiration.
              </p>
            </div>
          </div>
        </div>
        {detailsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white !rounded-xl p-6 w-[500px]">
              <h2 className="text-xl font-medium mb-4">Role Details</h2>

              {isRoleDetailsLoading ? (
                <div className="flex justify-center py-8">
                  <CircularProgress />
                </div>
              ) : (
                selectedRole && (
                  <>
                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Role Name
                      </label>
                      <p className="text-gray-900 p-2 bg-gray-50 rounded-xl">
                        {selectedRole.doc?.name || "N/A"}
                      </p>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Role Color
                      </label>
                      <div className="flex items-center gap-2">
                        <div
                          className="w-6 h-6 rounded-full border"
                          style={{ backgroundColor: selectedRole.doc.color }}
                        />
                        <p className="text-gray-900">
                          {selectedRole.doc.color}
                        </p>
                      </div>
                    </div>

                    <div className="mb-4">
                      <label className="block text-sm font-medium mb-2 text-gray-700">
                        Permissions
                      </label>
                      <div className="flex flex-wrap items-center gap-2">
                        {selectedRole?.doc.permissions?.map((permission) => (
                          <Chip
                            key={permission}
                            label={permission}
                            className="!capitalize !px-2 font-medium !bg-[#546FFF] !text-white"
                            size="small"
                            sx={{
                              "&.MuiChip-root": {
                                height: 28,
                                margin: "2px",
                              },
                            }}
                          />
                        ))}
                      </div>
                    </div>
                  </>
                )
              )}

              <Button
                onClick={() => setDetailsModalOpen(false)}
                className="!mt-4 !w-full !bg-[#546FFF] !text-white"
              >
                Close
              </Button>
            </div>
          </div>
        )}
        {openModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white !rounded-xl p-6 w-[500px]">
              <h2 className="text-2xl text-center font-medium mb-6">
                {isEditing ? "Edit Role" : "Create Role"}
              </h2>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    if (isEditing) {
                      await updateRole({
                        userId: user._id,
                        projectId,
                        roleId: editingRoleId,
                        roleData: newRole,
                      });
                    } else {
                      await createRole({
                        userId: user._id,
                        projectId,
                        roleData: newRole,
                      });
                    }
                    // Close modal and reset state only after successful mutation
                    setOpenModal(false);
                    setIsEditing(false);
                    setEditingRoleId(null);
                    setnewRole({ name: "", permissions: [], color: "#546FFF" });
                  } catch (error) {
                    // Errors are already handled by the mutation
                  }
                }}
              >
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    ROLE NAME
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={newRole.name}
                    onChange={(e) => handleInputChange(e, setnewRole)}
                    placeholder="Enter role name"
                    className="w-full p-2 border rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                {/* Role Name Input */}
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    ROLE COLOR
                  </label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      name="color"
                      value={newRole.color}
                      onChange={handleInputChange}
                      className="w-9 h-9 cursor-pointer "
                    />
                    <input
                      type="text"
                      name="color"
                      value={newRole.color}
                      onChange={handleInputChange}
                      className="w-32 p-2 border rounded-xl text-sm"
                      placeholder="Hex color code"
                    />
                  </div>
                </div>

                {/* Permissions Section */}
                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-semibold text-gray-900">
                      PERMISSIONS
                    </h3>
                    <button
                      type="button"
                      onClick={() =>
                        setnewRole({ ...newRole, permissions: [] })
                      }
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Clear permissions
                    </button>
                  </div>

                  {/* Permissions List */}
                  <div className="space-y-4 max-h-64 overflow-y-auto">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <h4 className="text-xs font-semibold text-gray-500 mb-2">
                        SERVER PERMISSIONS
                      </h4>

                      {/* Permission Items */}
                      {[
                        {
                          value: "Read",
                          label: "Read Access",
                          description: "Allows viewing content and information",
                        },
                        {
                          value: "Add",
                          label: "Add Content",
                          description:
                            "Allows creating new content and entries",
                        },
                        {
                          value: "Delete",
                          label: "Delete Content",
                          description: "Allows removing content and entries",
                        },
                        {
                          value: "Edit",
                          label: "Edit Content",
                          description: "Allows modifying existing content",
                        },
                        {
                          value: "Admin",
                          label: "Administrator",
                          description: "Full access to all permissions",
                        },
                      ].map((perm) => (
                        <div
                          key={perm.value}
                          className="flex items-center justify-between p-2 hover:bg-gray-100 rounded-md"
                        >
                          <div className="flex-1 mr-4">
                            <div className="text-sm font-medium text-gray-900">
                              {perm.label}
                            </div>
                            <div className="text-xs text-gray-500">
                              {perm.description}
                            </div>
                          </div>
                          <button
                            type="button" // Add this attribute
                            onClick={() => {
                              const perms = newRole.permissions.includes(
                                perm.value
                              )
                                ? newRole.permissions.filter(
                                    (p) => p !== perm.value
                                  )
                                : [...newRole.permissions, perm.value];
                              setnewRole({ ...newRole, permissions: perms });
                            }}
                            className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                              newRole.permissions.includes(perm.value)
                                ? "bg-[#546FFF]"
                                : "bg-gray-200"
                            }`}
                          >
                            <span
                              className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                                newRole.permissions.includes(perm.value)
                                  ? "translate-x-5"
                                  : "translate-x-0"
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2 mt-6 border-t pt-4">
                  <Button
                    onClick={() => {
                      setOpenModal(false);
                      setIsEditing(false);
                      setnewRole({
                        name: "",
                        permissions: [],
                        color: "#546FFF",
                      });
                    }}
                    variant="outlined"
                    className="!text-base !py-2 !capitalize !border-gray-500  !font-medium !text-black !rounded-[10px]"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="!text-base !py-2 !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-medium !text-white !rounded-[10px]"
                  >
                    {isEditing ? "Update Role" : "Create Role"}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
        {deleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white !rounded-xl p-6 w-[400px]">
              <h2 className="text-xl font-medium mb-4">Delete Role</h2>
              <p className="mb-6">Are you sure you want to delete this role?</p>
              <div className="flex justify-end gap-3">
                <Button
                  onClick={() => {
                    setDeleteModalOpen(false);
                    setRoleToDelete(null);
                  }}
                  className="!text-sm !capitalize !bg-gray-100 !text-gray-700 hover:!bg-gray-200 !h-9 !px-4 !rounded-[7px]"
                  disabled={isDeleting}
                >
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    try {
                      await deleteRole({
                        userId: user._id,
                        projectId,
                        roleId: roleToDelete,
                      });
                      setDeleteModalOpen(false);
                      setRoleToDelete(null);
                    } catch (error) {
                      console.error("Deletion failed:", error);
                    }
                  }}
                  className="!text-sm !capitalize !bg-red-600 hover:shadow-lg hover:shadow-red-500 hover:!bg-red-500 !text-white !h-9 !px-4 !rounded-[7px]"
                  disabled={isDeleting}
                >
                  {isDeleting ? (
                    <CircularProgress size={20} sx={{ color: "white" }} />
                  ) : (
                    "Delete"
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
        <div className="hidden 2xl:flex fixed right-0 top-0 h-full w-[420px] border-l border-gray-200 bg-[#F5F5F7] p-5 flex-col gap-4 overflow-y-auto">
          <div className="bg-white w-[370px] rounded-xl mt-[70px] h-full p-5 flex-col gap-4 overflow-y-auto bottom-0">
            <div className="flex justify-between items-center mb-4 gap-3">
              <div className="relative ">
                <span className="absolute inset-y-0 right-6 flex items-center ">
                  <Search className="h-5 w-5 text-[#8E92BC]" />
                </span>
                <input
                  type="search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 !rounded-[10px] focus:outline-none"
                  placeholder="Search Members"
                  // value={searchQuery}
                  // onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                onClick={() => setOpenModal(true)}
                className="!text-base !py-2 !capitalize !bg-[#546FFF] hover:shadow-lg hover:shadow-[#546FFF] !font-medium !text-white  !w-[100px] !rounded-xl"
              >
                Add Role
              </Button>
            </div>
            <div className="flex gap-1 flex-wrap">
              {rolesData?.doc.map((role) => (
                <div
                  key={role._id}
                  className="flex gap-2 px-2 py-2 hover:!border-[#546FFF] !items-center justify-between text-sm rounded-xl text-center !border-2 !border-gray-500 cursor-pointer"
                >
                  <div className="flex items-center gap-2 ">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: role.color }}
                    ></div>
                    <p className="text-gray-800 cursor-pointer">{role.name}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <Pencil
                      className="w-3 h-3 cursor-pointer"
                      onClick={(e) => {
                        e.stopPropagation();
                        setnewRole({
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
                      className="w-4 h-4 cursor-pointer"
                      onClick={() => {
                        setRoleToDelete(role._id);
                        setDeleteModalOpen(true);
                      }}
                    />
                    <ReceiptText
                      className="w-4 h-4 cursor-pointer"
                      onClick={() =>
                        handleRoleDetails(user._id, projectId, role._id)
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-5 font-semibold text-2xl">
              <h2 className="mb-4">Members - {project.memberCount}</h2>
              <div className="flex-col gap-3">
                {projectMembers.map((mem) => (
                  <div
                    key={mem.id}
                    className="flex gap-2 mb-2 items-center bg-gray-100 !rounded-xl !capitalize px-2 py-2"
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
      </div>
      <InviteModal
        projectId={projectId}
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        roles={rolesData}
      />
    </>
  );
}
export default ProjectDetails;
