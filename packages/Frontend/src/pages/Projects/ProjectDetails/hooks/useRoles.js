import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoles,
  createRole,
  getRoleById,
  deleteRole,
  updateRole,
} from "../api/roles";
import { toast } from "react-toastify";

export const useRoles = (userId, projectId) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isRoleDetailsLoading, setIsRoleDetailsLoading] = useState(false);
  const [editingRoleId, setEditingRoleId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [roleToDelete, setRoleToDelete] = useState(null);
  const [openModal, setOpenModal] = useState(false);
  const [newRole, setNewRole] = useState({
    name: "",
    permissions: [],
    color: "#546FFF",
  });
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPermissionWarning, setShowPermissionWarning] = useState(false);
  const [pendingPermissionChange, setPendingPermissionChange] = useState(null);

  const queryClient = useQueryClient();

  const { data: rolesData, isLoading: rolesLoading } = useQuery({
    queryKey: ["roles", projectId],
    queryFn: async () => {
      if (!userId || !projectId) return null;
      return await getRoles(userId, projectId);
    },
    enabled: !!userId && !!projectId,
  });

  const handleError = (error) => {
    return error?.response?.data?.message || "Something went wrong";
  };

  // Create Role Mutation with Optimistic Update
  const createRoleMutation = useMutation({
    mutationFn: async (roleData) => {
      if (!userId || !projectId) {
        throw new Error("User ID and Project ID are required");
      }
      return await createRole(userId, projectId, roleData);
    },
    onMutate: async (newRoleData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries(["roles", projectId]);

      // Snapshot the previous value
      const previousRoles = queryClient.getQueryData(["roles", projectId]);

      // Optimistically update to the new value
      queryClient.setQueryData(["roles", projectId], (old) => ({
        ...old,
        doc: [
          ...(old?.doc || []),
          {
            _id: "temp-" + Date.now(),
            ...newRoleData,
            members: [],
            createdAt: new Date().toISOString(),
          },
        ],
      }));

      return { previousRoles };
    },
    onError: (err, newRoleData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      queryClient.setQueryData(["roles", projectId], context.previousRoles);
      toast.error(handleError(err));
    },
    onSettled: () => {
      // Always refetch after error or success to ensure data is in sync
      queryClient.invalidateQueries(["roles", projectId]);
    },
    onSuccess: () => {
      setOpenModal(false);
      setNewRole({ name: "", permissions: [], color: "#546FFF" });
      toast.success("Role created successfully");
    },
  });

  // Update Role Mutation with Optimistic Update
  const updateRoleMutation = useMutation({
    mutationFn: async ({ roleId, roleData }) => {
      if (!userId || !projectId) {
        throw new Error("User ID and Project ID are required");
      }
      return await updateRole(userId, projectId, roleId, roleData);
    },
    onMutate: async ({ roleId, roleData }) => {
      await queryClient.cancelQueries(["roles", projectId]);
      const previousRoles = queryClient.getQueryData(["roles", projectId]);

      queryClient.setQueryData(["roles", projectId], (old) => ({
        ...old,
        doc: old.doc.map((role) =>
          role._id === roleId ? { ...role, ...roleData } : role,
        ),
      }));

      return { previousRoles };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["roles", projectId], context.previousRoles);
      toast.error(handleError(err));
    },
    onSettled: () => {
      queryClient.invalidateQueries(["roles", projectId]);
    },
    onSuccess: () => {
      setOpenModal(false);
      setNewRole({ name: "", permissions: [], color: "#546FFF" });
      toast.success("Role updated successfully");
    },
  });

  // Delete Role Mutation with Optimistic Update
  const deleteRoleMutation = useMutation({
    mutationFn: async (roleId) => {
      if (!userId || !projectId) {
        throw new Error("User ID and Project ID are required");
      }
      return await deleteRole(userId, projectId, roleId);
    },
    onMutate: async (roleId) => {
      await queryClient.cancelQueries(["roles", projectId]);
      const previousRoles = queryClient.getQueryData(["roles", projectId]);

      queryClient.setQueryData(["roles", projectId], (old) => ({
        ...old,
        doc: old.doc.filter((role) => role._id !== roleId),
      }));

      return { previousRoles };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(["roles", projectId], context.previousRoles);
      toast.error(handleError(err));
    },
    onSettled: () => {
      queryClient.invalidateQueries(["roles", projectId]);
    },
    onSuccess: () => {
      setDeleteModalOpen(false);
      setRoleToDelete(null);
      toast.success("Role deleted successfully");
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRole((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePermissionChange = (perm) => {
    const isCurrentUserRole = rolesData?.doc
      .find((role) => role._id === editingRoleId)
      ?.members?.some((member) => member.user._id === userId);

    if (
      isCurrentUserRole &&
      newRole.permissions.length === 1 &&
      newRole.permissions.includes(perm)
    ) {
      setPendingPermissionChange(perm);
      setShowPermissionWarning(true);
      return;
    }

    const perms = newRole.permissions.includes(perm)
      ? newRole.permissions.filter((p) => p !== perm)
      : [...newRole.permissions, perm];
    setNewRole({ ...newRole, permissions: perms });
  };

  const handleConfirmPermissionChange = async () => {
    if (!pendingPermissionChange) return;

    const perms = newRole.permissions.filter(
      (p) => p !== pendingPermissionChange,
    );
    setNewRole({ ...newRole, permissions: perms });
    setShowPermissionWarning(false);
    setPendingPermissionChange(null);

    try {
      await updateRoleMutation.mutateAsync({
        roleId: editingRoleId,
        roleData: { ...newRole, permissions: perms },
      });
    } catch (error) {
      if (
        error.message === "You don't have permission to perform this action"
      ) {
        toast.error("You don't have permission to modify this role");
        const currentRole = rolesData?.doc.find(
          (role) => role._id === editingRoleId,
        );
        if (currentRole) {
          setNewRole({
            ...newRole,
            permissions: currentRole.permissions,
          });
        }
      } else {
        toast.error("Failed to update role permissions");
      }
    }
  };

  const handleRoleDetails = async (roleId) => {
    setDetailsModalOpen(true);
    setSelectedRole(null);
    setIsRoleDetailsLoading(true);

    try {
      const roleDetails = await getRoleById(userId, projectId, roleId);
      setSelectedRole(roleDetails);
    } catch (error) {
      console.error("Error fetching role details:", error);
      toast.error(handleError(error));
    } finally {
      setIsRoleDetailsLoading(false);
    }
  };

  return {
    deleteModalOpen,
    setDeleteModalOpen,
    isRoleDetailsLoading,
    editingRoleId,
    setEditingRoleId,
    isEditing,
    setIsEditing,
    roleToDelete,
    setRoleToDelete,
    openModal,
    setOpenModal,
    newRole,
    setNewRole,
    detailsModalOpen,
    setDetailsModalOpen,
    selectedRole,
    setSelectedRole,
    showPermissionWarning,
    setShowPermissionWarning,
    pendingPermissionChange,
    setPendingPermissionChange,
    rolesData,
    rolesLoading,
    createRoleMutation,
    updateRoleMutation,
    deleteRoleMutation,
    handleInputChange,
    handlePermissionChange,
    handleConfirmPermissionChange,
    handleRoleDetails,
  };
};
