import { CircularProgress } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getProjectById } from "../../../../api/project";
import { useAuth } from "../../../../hooks/auth/useAuth";
import { useRoles } from "../../../../hooks/features/useRoles";
import InviteModal from "../../Invite/InviteModal";
import ProjectHeader from "./components/ProjectHeader";
import ProjectInfo from "./components/ProjectInfo";
import ProjectDescription from "./components/ProjectDescription";
import Comments from "./components/Comments";
import Roles from "./components/Roles";
import { getRoles } from "../../../../api/roles";
import RoleModal from "./components/RoleModal";
import DeleteRoleModal from "./components/DeleteRoleModal";
import RoleDetailsModal from "./components/RoleDetailsModal";
import PermissionWarningModal from "./components/PermissionWarningModal";
import { Menu } from "lucide-react";
import MobileRoles from "./components/MobileRoles";

function ProjectDetails() {
  const { user } = useAuth();
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [showRolesSidebar, setShowRolesSidebar] = useState(false);

  // Querys
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["project", projectId],
    queryFn: async () => {
      if (!projectId) {
        throw new Error("Project ID is required");
      }
      return await getProjectById(projectId);
    },
    enabled: !!projectId,
  });

  const { data: rolesData } = useQuery({
    queryKey: ["roles", projectId],
    queryFn: async () => {
      if (!user?._id || !projectId) return null;
      return await getRoles(user._id, projectId);
    },
    enabled: !!user?._id && !!projectId,
  });

  // Use useRoles hook
  const {
    deleteModalOpen,
    setDeleteModalOpen,
    isRoleDetailsLoading,
    editingRoleId,
    setEditingRoleId,
    isEditing,
    setIsEditing,
    roleToDelete,
    setRoleToDelete,
    openModal: roleModalOpen,
    setOpenModal: setRoleModalOpen,
    newRole,
    setNewRole,
    detailsModalOpen,
    setDetailsModalOpen,
    selectedRole,
    showPermissionWarning,
    setShowPermissionWarning,
    setPendingPermissionChange,
    createRoleMutation,
    updateRoleMutation,
    deleteRoleMutation,
    handleInputChange,
    handlePermissionChange,
    handleConfirmPermissionChange,
    handleRoleDetails,
  } = useRoles(user?._id, projectId);

  const handleClick = () => {
    navigate(`/projects/users/${user?._id}/projects/${projectId}/tasks`);
  };

  if (isLoading) {
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

  if (!data?.doc) {
    return (
      <div className="text-center text-red-500">Error: Project not found</div>
    );
  }

  const project = data.doc;

  return (
    <>
      <div className="flex min-h-screen dark:bg-[#080808] bg-[#FAFAFA]">
        {/* Mobile Roles Toggle Button - Only shows on mobile */}
        <div className="lg:hidden fixed bottom-8 right-4 z-40">
          <button
            onClick={() => setShowRolesSidebar(!showRolesSidebar)}
            className="bg-[#546FFF] text-sm text-white p-3 rounded-xl shadow-lg"
          >
            Roles & <br /> Members
          </button>
        </div>

        <div className="w-full lg:w-[calc(100%-420px)]">
          <ProjectHeader project={project} onJoinClick={handleClick} />
          <ProjectInfo
            project={project}
            onAddMembersClick={() => setInviteModalOpen(true)}
          />
          <ProjectDescription description={project?.description} />
          <Comments userId={user._id} projectId={projectId} user={user} />
        </div>

        {/* Mobile overlay for sidebar - Only shows on mobile */}
        {showRolesSidebar && (
          <div
            className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
            onClick={() => setShowRolesSidebar(false)}
          />
        )}

        {/* Desktop Roles Sidebar - Always shows on desktop */}
        {projectId && user?._id && (
          <div className="hidden 2xl:flex dark:bg-[#080808] fixed right-0 top-0 dark:border-0 h-full w-[420px] border-l border-gray-200 bg-[#F5F5F7]">
            <Roles
              userId={user._id}
              projectId={projectId}
              project={project}
              setDeleteModalOpen={setDeleteModalOpen}
              setEditingRoleId={setEditingRoleId}
              setIsEditing={setIsEditing}
              setRoleToDelete={setRoleToDelete}
              setOpenModal={setRoleModalOpen}
              setNewRole={setNewRole}
              setDetailsModalOpen={setDetailsModalOpen}
              setShowPermissionWarning={setShowPermissionWarning}
              setPendingPermissionChange={setPendingPermissionChange}
              handleRoleDetails={handleRoleDetails}
              rolesData={rolesData}
            />
          </div>
        )}

        {/* Mobile Roles Sidebar - Only shows when toggled */}
        {projectId && user?._id && (
          <div
            className={`
            ${showRolesSidebar ? "translate-x-0" : "translate-x-full"}
            lg:hidden
            fixed right-0 top-0 h-full w-full sm:w-[400px]
            transition-transform duration-300 ease-in-out
            z-40
          `}
          >
            <MobileRoles
              userId={user._id}
              projectId={projectId}
              project={project}
              setDeleteModalOpen={setDeleteModalOpen}
              setEditingRoleId={setEditingRoleId}
              setIsEditing={setIsEditing}
              setRoleToDelete={setRoleToDelete}
              setOpenModal={setRoleModalOpen}
              setNewRole={setNewRole}
              setDetailsModalOpen={setDetailsModalOpen}
              setShowPermissionWarning={setShowPermissionWarning}
              setPendingPermissionChange={setPendingPermissionChange}
              handleRoleDetails={handleRoleDetails}
              rolesData={rolesData}
              onCloseMobile={() => setShowRolesSidebar(false)}
            />
          </div>
        )}
      </div>

      {/* All modals remain the same */}
      <InviteModal
        projectId={projectId}
        open={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        roles={rolesData}
        project={project}
      />

      <RoleModal
        open={roleModalOpen}
        onClose={() => {
          setRoleModalOpen(false);
          setIsEditing(false);
          setNewRole({ name: "", permissions: [], color: "#546FFF" });
        }}
        isEditing={isEditing}
        newRole={newRole}
        onInputChange={handleInputChange}
        onPermissionChange={handlePermissionChange}
        onSubmit={async (e) => {
          e.preventDefault();
          try {
            if (isEditing) {
              await updateRoleMutation.mutateAsync({
                roleId: editingRoleId,
                roleData: newRole,
              });
            } else {
              await createRoleMutation.mutateAsync(newRole);
            }
          } catch (error) {
            console.error("Error saving role:", error);
          }
        }}
      />

      <DeleteRoleModal
        open={deleteModalOpen}
        onClose={() => {
          setDeleteModalOpen(false);
          setRoleToDelete(null);
        }}
        onDelete={async () => {
          try {
            await deleteRoleMutation.mutateAsync(roleToDelete);
          } catch (error) {
            console.error("Error deleting role:", error);
          }
        }}
        isDeleting={deleteRoleMutation.isLoading}
      />

      <RoleDetailsModal
        open={detailsModalOpen}
        onClose={() => setDetailsModalOpen(false)}
        role={selectedRole}
        isLoading={isRoleDetailsLoading}
      />

      <PermissionWarningModal
        open={showPermissionWarning}
        onClose={() => {
          setShowPermissionWarning(false);
          setPendingPermissionChange(null);
        }}
        onConfirm={handleConfirmPermissionChange}
      />
    </>
  );
}

export default ProjectDetails;
