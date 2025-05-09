import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getRoles,
  createRole,
  getRoleById,
  deleteRole,
  updateRole,
} from "../api/roles";
import { toast } from "react-toastify";
import API from "../api/auth";

export const useRoles = () => {
  const queryClient = useQueryClient();

  const handleError = (error) => {
    return error?.response?.data?.message || "Something went wrong";
  };

  // Create Role Mutation with Optimistic Update
  const createRoleMutation = useMutation({
    mutationFn: ({ userId, projectId, roleData }) =>
      createRole(userId, projectId, roleData),
    onMutate: async ({ projectId, roleData }) => {
      await queryClient.cancelQueries(["roles", projectId]);
      const previousRoles = queryClient.getQueryData(["roles", projectId]);

      queryClient.setQueryData(["roles", projectId], (old) => ({
        ...old,
        doc: [...old.doc, { ...roleData, _id: `temp-${Date.now()}` }],
      }));

      return { previousRoles };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["roles", variables.projectId],
        context.previousRoles
      );
      toast.error("Failed to create role: " + handleError(err));
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["roles", variables.projectId]);
      toast.success("Role created successfully!");
    },
  });

  // Update Role Mutation with Optimistic Update
  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, projectId, roleId, roleData }) =>
      updateRole(userId, projectId, roleId, roleData),
    onMutate: async ({ projectId, roleId, roleData }) => {
      await queryClient.cancelQueries(["roles", projectId]);
      const previousRoles = queryClient.getQueryData(["roles", projectId]);

      queryClient.setQueryData(["roles", projectId], (old) => ({
        ...old,
        doc: old.doc.map((role) =>
          role._id === roleId ? { ...role, ...roleData } : role
        ),
      }));

      return { previousRoles };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["roles", variables.projectId],
        context.previousRoles
      );
      toast.error("Failed to update role: " + handleError(err));
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["roles", variables.projectId]);
      toast.success("Role updated successfully!");
    },
  });

  // Delete Role Mutation with Optimistic Update
  const deleteRoleMutation = useMutation({
    mutationFn: ({ userId, projectId, roleId }) =>
      deleteRole(userId, projectId, roleId),
    onMutate: async ({ projectId, roleId }) => {
      await queryClient.cancelQueries(["roles", projectId]);
      const previousRoles = queryClient.getQueryData(["roles", projectId]);

      queryClient.setQueryData(["roles", projectId], (old) => ({
        ...old,
        doc: old.doc.filter((role) => role._id !== roleId),
      }));

      return { previousRoles };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(
        ["roles", variables.projectId],
        context.previousRoles
      );
      toast.error("Failed to delete role: " + handleError(err));
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(["roles", variables.projectId]);
      toast.success("Role deleted successfully!");
    },
  });

  return {
    createRole: createRoleMutation.mutateAsync,
    updateRole: updateRoleMutation.mutateAsync,
    deleteRole: deleteRoleMutation.mutateAsync,
    getRoleById,
    isLoading: createRoleMutation.isLoading,
    isUpdating: updateRoleMutation.isLoading,
    isDeleting: deleteRoleMutation.isLoading,
  };
};
